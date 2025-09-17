#!/usr/bin/env python3
"""
MarkDown Converter Service
Provides file conversion functionality using the markitdown library
"""

import sys
import json
import os
from pathlib import Path

try:
    from markitdown import MarkItDown
except ImportError:
    print(json.dumps({
        "success": False,
        "error": "MarkItDown library not found. Please install with: pip install markitdown"
    }))
    sys.exit(1)

def convert_file(input_path, output_path=None):
    """Convert a file to markdown format"""
    try:
        # Initialize MarkItDown
        md = MarkItDown()

        # Convert the file
        result = md.convert(input_path)

        if not result.text_content:
            return {
                "success": False,
                "error": "No content could be extracted from the file"
            }

        # Determine output path if not provided
        if not output_path:
            input_file = Path(input_path)
            output_path = input_file.parent / f"{input_file.stem}.md"

        # Write the markdown content
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(result.text_content)

        return {
            "success": True,
            "input_path": str(input_path),
            "output_path": str(output_path),
            "content_length": len(result.text_content)
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "input_path": str(input_path) if input_path else None
        }

def get_supported_extensions():
    """Get list of supported file extensions"""
    return {
        "success": True,
        "extensions": [
            ".pdf", ".docx", ".pptx", ".xlsx", ".doc", ".ppt", ".xls",
            ".html", ".htm", ".csv", ".json", ".xml", ".txt",
            ".zip", ".epub", ".jpg", ".jpeg", ".png", ".bmp", ".gif",
            ".mp3", ".wav", ".m4a", ".flac"
        ]
    }

def main():
    """Main CLI interface"""
    if len(sys.argv) < 2:
        print(json.dumps({
            "success": False,
            "error": "Usage: python markdown_converter.py <command> [args...]"
        }))
        sys.exit(1)

    command = sys.argv[1]

    if command == "convert":
        if len(sys.argv) < 3:
            print(json.dumps({
                "success": False,
                "error": "Usage: python markdown_converter.py convert <input_file> [output_file]"
            }))
            sys.exit(1)

        input_file = sys.argv[2]
        output_file = sys.argv[3] if len(sys.argv) > 3 else None

        if not os.path.exists(input_file):
            print(json.dumps({
                "success": False,
                "error": f"Input file does not exist: {input_file}"
            }))
            sys.exit(1)

        result = convert_file(input_file, output_file)
        print(json.dumps(result))

    elif command == "supported":
        result = get_supported_extensions()
        print(json.dumps(result))

    else:
        print(json.dumps({
            "success": False,
            "error": f"Unknown command: {command}"
        }))
        sys.exit(1)

if __name__ == "__main__":
    main()