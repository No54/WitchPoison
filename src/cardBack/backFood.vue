<template>
    <svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <!-- 背景渐变 -->
        <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#006400;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#228B22;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#32CD32;stop-opacity:1" />
            </linearGradient>
            <pattern id="pentagramPattern" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 5 L36 20 L52 20 L40 32 L46 48 L30 38 L14 48 L20 32 L8 20 L24 20 Z" fill="none"
                    stroke="rgba(255, 255, 255, 0.1)" stroke-width="1" />
            </pattern>
            <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        <!-- 背景 -->
        <rect width="300" height="300" fill="url(#bgGradient)" rx="15" ry="15" />

        <!-- 纹理图案 -->
        <rect width="300" height="300" fill="url(#pentagramPattern)" rx="15" ry="15" />

        <!-- 边框 -->
        <rect x="15" y="15" width="270" height="270" fill="none" stroke="rgba(255, 255, 255, 0.8)" stroke-width="3"
            rx="10" ry="10" />
        <rect x="25" y="25" width="250" height="250" fill="none" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1"
            rx="8" ry="8" />

        <!-- 中央食物图标 -->
        <circle cx="150" cy="150" r="40" fill="rgba(255, 0, 0, 0.8)" filter="url(#glow)" />
        <path d="M150 110 C140 100 130 105 135 115 C125 125 135 135 145 130" fill="rgba(139, 69, 19, 0.8)"
            filter="url(#glow)" />

        <!-- 食物图标装饰 -->
        <circle cx="100" cy="200" r="25" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255, 255, 255, 0.6)"
            stroke-width="2" />
        <circle cx="200" cy="200" r="25" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255, 255, 255, 0.6)"
            stroke-width="2" />

        <!-- 角落装饰 -->
        <path d="M35 35 L55 35 L55 55 L35 55 Z" fill="none" stroke="rgba(255, 255, 255, 0.6)" stroke-width="2" />
        <path d="M265 35 L245 35 L245 55 L265 55 Z" fill="none" stroke="rgba(255, 255, 255, 0.6)" stroke-width="2" />
        <path d="M35 265 L55 265 L55 245 L35 245 Z" fill="none" stroke="rgba(255, 255, 255, 0.6)" stroke-width="2" />
        <path d="M265 265 L245 265 L245 245 L265 245 Z" fill="none" stroke="rgba(255, 255, 255, 0.6)"
            stroke-width="2" />
    </svg>
</template>
