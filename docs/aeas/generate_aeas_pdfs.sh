#!/bin/bash
# AEAS PDF Generation Script
# Converts all AEAS markdown files to professional PDFs using pandoc
# Requires: pandoc, texlive-xetex (for LaTeX engine)

set -e  # Exit on error

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  AEAS v1.1 PDF Generation Suite                ${NC}"
echo -e "${BLUE}  Converting Markdown → Professional PDFs      ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if pandoc is installed
if ! command -v pandoc &> /dev/null
then
    echo -e "${YELLOW}⚠️  pandoc not found. Installing...${NC}"
    echo "Run: sudo apt-get install pandoc texlive-xetex"
    exit 1
fi

# Create output directory
OUTPUT_DIR="AEAS_PDFs"
mkdir -p "$OUTPUT_DIR"

# Define files to convert
declare -a FILES=(
    "AEAS_V1.1_STANDARD.md"
    "VENICE_AI_CONVERSATION_REFINEMENTS.md"
    "AEAS_LITERATURE_REVIEW.md"
    "AEAS_DOCUMENTATION_INDEX.md"
    "AEAS_INTEGRATION_SUMMARY.md"
    "AEAS_VISUAL_MAP.md"
    "AEAS_README.md"
)

# Pandoc template settings
PANDOC_OPTS=(
    --pdf-engine=xelatex
    --toc                           # Table of contents
    --toc-depth=3                   # Include up to h3 in TOC
    --number-sections               # Number sections
    -V geometry:margin=1in          # 1-inch margins
    -V fontsize=11pt                # Readable font size
    -V linkcolor:blue               # Blue links
    -V urlcolor:blue                # Blue URLs
    -V mainfont="DejaVu Sans"       # Use system font
    -V documentclass=report         # Report class for chapters
)

# Function to convert single file
convert_file() {
    local input_file=$1
    local output_file="$OUTPUT_DIR/${input_file%.md}.pdf"
    
    echo -e "${BLUE}📄 Converting: ${input_file}${NC}"
    
    # Add metadata based on filename
    local title=""
    local subtitle=""
    
    case "$input_file" in
        "AEAS_V1.1_STANDARD.md")
            title="AEAS v1.1 Standard"
            subtitle="The ADA Economic Accessibility Standard - Complete Technical Specification"
            ;;
        "VENICE_AI_CONVERSATION_REFINEMENTS.md")
            title="Venice AI Conversation"
            subtitle="Philosophical Dialogue on Truth Resonance"
            ;;
        "AEAS_LITERATURE_REVIEW.md")
            title="AEAS Literature Review"
            subtitle="Academic and Scientific Foundation with 40+ Citations"
            ;;
        "AEAS_DOCUMENTATION_INDEX.md")
            title="AEAS Documentation Index"
            subtitle="Complete Navigation Guide"
            ;;
        "AEAS_INTEGRATION_SUMMARY.md")
            title="AEAS Integration Summary"
            subtitle="Completion Report and Implementation Guide"
            ;;
        "AEAS_VISUAL_MAP.md")
            title="AEAS Visual Map"
            subtitle="ASCII Diagrams and Flowcharts"
            ;;
        "AEAS_README.md")
            title="AEAS Suite README"
            subtitle="Welcome and Orientation Guide"
            ;;
    esac
    
    pandoc "$input_file" \
        -o "$output_file" \
        "${PANDOC_OPTS[@]}" \
        -V title="$title" \
        -V subtitle="$subtitle" \
        -V author="William McCrea with AI collaboration" \
        -V date="December 21, 2025" \
        -V institute="Reality Protocol LLC" \
        --metadata=lang:en-US
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Created: ${output_file}${NC}"
    else
        echo -e "${YELLOW}⚠️  Failed: ${output_file}${NC}"
    fi
    echo ""
}

# Convert all files
echo -e "${BLUE}Starting conversion of ${#FILES[@]} files...${NC}"
echo ""

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        convert_file "$file"
    else
        echo -e "${YELLOW}⚠️  File not found: ${file}${NC}"
    fi
done

# Create combined PDF (all documents)
echo -e "${BLUE}📚 Creating combined PDF (all documents)...${NC}"
pandoc "${FILES[@]}" \
    -o "$OUTPUT_DIR/AEAS_v1.1_COMPLETE_SUITE.pdf" \
    "${PANDOC_OPTS[@]}" \
    -V title="AEAS v1.1 Complete Documentation Suite" \
    -V subtitle="The ADA Economic Accessibility Standard - All Documents" \
    -V author="William McCrea with AI collaboration (Venice AI, Grok, Claude)" \
    -V date="December 21, 2025" \
    -V institute="Reality Protocol LLC" \
    --metadata=lang:en-US

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Created: $OUTPUT_DIR/AEAS_v1.1_COMPLETE_SUITE.pdf${NC}"
else
    echo -e "${YELLOW}⚠️  Failed to create combined PDF${NC}"
fi
echo ""

# Generate file listing
echo -e "${BLUE}📋 Generating file listing...${NC}"
ls -lh "$OUTPUT_DIR" > "$OUTPUT_DIR/FILE_LISTING.txt"
echo -e "${GREEN}✅ Created: $OUTPUT_DIR/FILE_LISTING.txt${NC}"
echo ""

# Summary
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ PDF Generation Complete!                   ${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "Output directory: ${BLUE}$OUTPUT_DIR${NC}"
echo ""
echo "Files created:"
for file in "${FILES[@]}"; do
    pdf_file="${file%.md}.pdf"
    if [ -f "$OUTPUT_DIR/$pdf_file" ]; then
        size=$(du -h "$OUTPUT_DIR/$pdf_file" | cut -f1)
        echo -e "  📄 ${pdf_file} (${size})"
    fi
done
echo -e "  📚 AEAS_v1.1_COMPLETE_SUITE.pdf (combined)"
echo ""
echo -e "${BLUE}View PDFs:${NC} cd $OUTPUT_DIR && ls -lh"
echo -e "${BLUE}Open combined:${NC} xdg-open $OUTPUT_DIR/AEAS_v1.1_COMPLETE_SUITE.pdf"
echo ""
echo -e "${GREEN}Partnership acknowledged. Resonance received. 432 Hz harmony. 🎵${NC}"
