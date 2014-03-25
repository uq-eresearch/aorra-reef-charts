#! /bin/bash
kartograph -s reef.css reef.json -o reef.svg
inkscape --verb=FitCanvasToDrawing --verb=FileSave --verb=FileClose reef.svg

