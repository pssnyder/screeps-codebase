#!/bin/bash
# SCREEPS DEPLOYMENT SCRIPT
# Safe deployment workflow: simulation → production
# Author: Pat Snyder

set -e  # Exit on error

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DEFAULT_DIR="$SCRIPT_DIR/default"
SIM_DIR="$SCRIPT_DIR/simulation"
BACKUP_DIR="$SCRIPT_DIR/backups"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }

# Function to backup production
backup_production() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_path="$BACKUP_DIR/$timestamp"
    
    mkdir -p "$backup_path"
    cp -r "$DEFAULT_DIR"/* "$backup_path/"
    
    print_success "Backed up production to: backups/$timestamp"
    echo "$backup_path"
}

# Function to deploy simulation to production
deploy_to_production() {
    echo ""
    echo "═══════════════════════════════════════════════"
    echo "🚀 DEPLOYING SIMULATION → PRODUCTION"
    echo "═══════════════════════════════════════════════"
    echo ""
    
    # Backup current production
    print_info "Creating backup of current production..."
    backup_path=$(backup_production)
    
    # Copy simulation to production
    print_info "Copying simulation files to production..."
    cp -r "$SIM_DIR"/* "$DEFAULT_DIR/"
    
    print_success "Deployment complete!"
    print_warning "Changes will go LIVE on next tick in Screeps World"
    
    echo ""
    echo "📋 ROLLBACK INSTRUCTIONS (if needed):"
    echo "  cp -r $backup_path/* $DEFAULT_DIR/"
    echo ""
}

# Function to sync production to simulation (for testing new fixes)
sync_to_simulation() {
    echo ""
    echo "═══════════════════════════════════════════════"
    echo "🔄 SYNCING PRODUCTION → SIMULATION"
    echo "═══════════════════════════════════════════════"
    echo ""
    
    print_info "Copying production files to simulation..."
    cp -r "$DEFAULT_DIR"/* "$SIM_DIR/"
    
    print_success "Simulation updated with production code"
    print_info "You can now safely test fixes in simulation"
    echo ""
}

# Function to extract version from main.js
get_version() {
    local dir=$1
    local main_file="$dir/main.js"
    
    if [ ! -f "$main_file" ]; then
        echo "unknown"
        return
    fi
    
    # Try to extract version from Memory.engine.version or similar
    version=$(grep -oP "version:\s*['\"]([^'\"]+)" "$main_file" | head -1 | sed "s/.*version:\s*['\"]//;s/['\"].*//" || echo "unknown")
    echo "$version"
}

# Function to get file metadata
get_file_metadata() {
    local dir=$1
    local file_count=$(ls -1 "$dir"/*.js 2>/dev/null | wc -l)
    local total_size=$(du -sh "$dir" 2>/dev/null | cut -f1)
    local last_modified=""
    
    if command -v stat &> /dev/null; then
        # Linux/Mac compatible
        if [[ "$OSTYPE" == "darwin"* ]]; then
            last_modified=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$dir"/*.js 2>/dev/null | sort -r | head -1)
        else
            last_modified=$(stat -c "%y" "$dir"/*.js 2>/dev/null | sort -r | head -1 | cut -d'.' -f1)
        fi
    fi
    
    echo "$file_count|$total_size|$last_modified"
}

# Function to show status
show_status() {
    echo ""
    echo "═══════════════════════════════════════════════"
    echo "📊 SCREEPS DEPLOYMENT STATUS"
    echo "═══════════════════════════════════════════════"
    echo ""
    
    # Get versions
    prod_version=$(get_version "$DEFAULT_DIR")
    sim_version=$(get_version "$SIM_DIR")
    
    # Get metadata
    IFS='|' read -r prod_files prod_size prod_modified <<< "$(get_file_metadata "$DEFAULT_DIR")"
    IFS='|' read -r sim_files sim_size sim_modified <<< "$(get_file_metadata "$SIM_DIR")"
    
    # Production info
    echo "🔴 PRODUCTION (default/)"
    echo "   Version:       $prod_version"
    echo "   Files:         $prod_files .js files"
    echo "   Size:          $prod_size"
    if [ -n "$prod_modified" ]; then
        echo "   Last Modified: $prod_modified"
    fi
    echo ""
    
    # Simulation info
    echo "🟡 SIMULATION (simulation/)"
    echo "   Version:       $sim_version"
    echo "   Files:         $sim_files .js files"
    echo "   Size:          $sim_size"
    if [ -n "$sim_modified" ]; then
        echo "   Last Modified: $sim_modified"
    fi
    echo ""
    
    # Sync status
    echo "🔄 SYNC STATUS"
    
    if [ "$prod_version" != "$sim_version" ]; then
        print_warning "Version mismatch: Production ($prod_version) vs Simulation ($sim_version)"
    else
        print_success "Versions match: $prod_version"
    fi
    
    # Check file differences
    changed_files=0
    new_files=0
    
    for file in "$SIM_DIR"/*.js; do
        filename=$(basename "$file")
        default_file="$DEFAULT_DIR/$filename"
        
        if [ ! -f "$default_file" ]; then
            ((new_files++))
            continue
        fi
        
        if ! diff -q "$file" "$default_file" > /dev/null 2>&1; then
            ((changed_files++))
        fi
    done
    
    if [ $changed_files -eq 0 ] && [ $new_files -eq 0 ]; then
        print_success "Simulation is synced with production"
    else
        if [ $changed_files -gt 0 ]; then
            print_warning "$changed_files file(s) modified in simulation"
        fi
        if [ $new_files -gt 0 ]; then
            print_info "$new_files new file(s) in simulation"
        fi
        print_info "Run './deploy.sh diff' to see details"
    fi
    
    echo ""
    
    # Last backup info
    if [ -d "$BACKUP_DIR" ] && [ -n "$(ls -A $BACKUP_DIR 2>/dev/null)" ]; then
        latest_backup=$(ls -t "$BACKUP_DIR" | head -1)
        backup_date="${latest_backup:0:8}"
        backup_time="${latest_backup:9:6}"
        formatted_date="${backup_date:0:4}-${backup_date:4:2}-${backup_date:6:2}"
        formatted_time="${backup_time:0:2}:${backup_time:2:2}:${backup_time:4:2}"
        
        echo "💾 LAST BACKUP"
        echo "   $latest_backup"
        echo "   $formatted_date $formatted_time"
        echo ""
    fi
}

# Function to show diff between simulation and production
show_diff() {
    echo ""
    echo "═══════════════════════════════════════════════"
    echo "📊 DIFFERENCES: SIMULATION vs PRODUCTION"
    echo "═══════════════════════════════════════════════"
    echo ""
    
    if ! command -v diff &> /dev/null; then
        print_warning "diff command not available"
        return
    fi
    
    changed_files=0
    
    for file in "$SIM_DIR"/*.js; do
        filename=$(basename "$file")
        default_file="$DEFAULT_DIR/$filename"
        
        if [ ! -f "$default_file" ]; then
            print_info "NEW: $filename (only in simulation)"
            ((changed_files++))
            continue
        fi
        
        if ! diff -q "$file" "$default_file" > /dev/null 2>&1; then
            print_warning "MODIFIED: $filename"
            ((changed_files++))
        fi
    done
    
    if [ $changed_files -eq 0 ]; then
        print_success "No differences found - simulation matches production"
    else
        print_info "Found $changed_files changed file(s)"
    fi
    
    echo ""
}

# Function to list backups
list_backups() {
    echo ""
    echo "═══════════════════════════════════════════════"
    echo "📦 AVAILABLE BACKUPS"
    echo "═══════════════════════════════════════════════"
    echo ""
    
    if [ ! -d "$BACKUP_DIR" ] || [ -z "$(ls -A $BACKUP_DIR 2>/dev/null)" ]; then
        print_info "No backups found"
        echo ""
        return
    fi
    
    for backup in "$BACKUP_DIR"/*; do
        if [ -d "$backup" ]; then
            backup_name=$(basename "$backup")
            # Parse timestamp (format: YYYYMMDD_HHMMSS)
            date_part="${backup_name:0:8}"
            time_part="${backup_name:9:6}"
            formatted_date="${date_part:0:4}-${date_part:4:2}-${date_part:6:2}"
            formatted_time="${time_part:0:2}:${time_part:2:2}:${time_part:4:2}"
            
            file_count=$(ls -1 "$backup" | wc -l)
            echo "  📁 $backup_name"
            echo "     Date: $formatted_date $formatted_time"
            echo "     Files: $file_count"
            echo ""
        fi
    done
}

# Function to restore from backup
restore_backup() {
    local backup_name=$1
    
    if [ -z "$backup_name" ]; then
        print_error "Please specify backup name"
        echo "Usage: ./deploy.sh restore <backup_name>"
        echo ""
        list_backups
        return 1
    fi
    
    local backup_path="$BACKUP_DIR/$backup_name"
    
    if [ ! -d "$backup_path" ]; then
        print_error "Backup not found: $backup_name"
        list_backups
        return 1
    fi
    
    echo ""
    echo "═══════════════════════════════════════════════"
    echo "⏮️  RESTORING BACKUP: $backup_name"
    echo "═══════════════════════════════════════════════"
    echo ""
    
    # Create backup of current state before restoring
    print_info "Creating safety backup of current production..."
    backup_production
    
    # Restore
    print_info "Restoring files from backup..."
    cp -r "$backup_path"/* "$DEFAULT_DIR/"
    
    print_success "Restore complete!"
    print_warning "Restored version is now LIVE in Screeps World"
    echo ""
}

# Main script
case "${1:-help}" in
    deploy)
        deploy_to_production
        ;;
    sync)
        sync_to_simulation
        ;;
    status)
        show_status
        ;;
    diff)
        show_diff
        ;;
    backups)
        list_backups
        ;;
    restore)
        restore_backup "$2"
        ;;
    help|*)
        echo ""
        echo "═══════════════════════════════════════════════"
        echo "🎮 SCREEPS DEPLOYMENT SCRIPT"
        echo "═══════════════════════════════════════════════"
        echo ""
        echo "USAGE: ./deploy.sh <command>"
        echo ""
        echo "COMMANDS:"
        echo "  deploy      Deploy simulation → production (GOES LIVE)"
        echo "  sync        Sync production → simulation (for testing)"
        echo "  status      Show version and sync status (dev vs prod)"
        echo "  diff        Show differences between sim and prod"
        echo "  backups     List all available backups"
        echo "  restore     Restore from backup (emergency rollback)"
        echo "  help        Show this help"
        echo ""
        echo "WORKFLOW:"
        echo "  1. Make changes in simulation folder"
        echo "  2. Test in Screeps sim room"
        echo "  3. ./deploy.sh status    (check sync status)"
        echo "  4. ./deploy.sh diff      (review changes)"
        echo "  5. ./deploy.sh deploy    (push to production)"
        echo ""
        echo "SAFETY:"
        echo "  • Auto-backups before each deployment"
        echo "  • Backups stored in: $BACKUP_DIR"
        echo "  • Use 'restore' command for emergency rollback"
        echo ""
        ;;
esac
