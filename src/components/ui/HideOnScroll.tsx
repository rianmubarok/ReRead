"use client";

import React, { useState, useEffect, useRef } from 'react';

interface HideOnScrollProps {
    children: React.ReactNode;
    className?: string;
}

export default function HideOnScroll({ children, className = "" }: HideOnScrollProps) {
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Find the scrolling container (main element)
        const findScrollingContainer = (): HTMLElement | null => {
            if (!containerRef.current) return null;
            
            // Try to find main element first (most common case)
            const mainElement = document.querySelector('main');
            if (mainElement) {
                const style = window.getComputedStyle(mainElement);
                if (style.overflowY === 'auto' || style.overflowY === 'scroll' || 
                    style.overflow === 'auto' || style.overflow === 'scroll') {
                    return mainElement as HTMLElement;
                }
            }

            // Fallback: traverse up the DOM tree
            let element = containerRef.current.parentElement;
            while (element && element !== document.body) {
                const style = window.getComputedStyle(element);
                if (style.overflowY === 'auto' || style.overflowY === 'scroll' || 
                    style.overflow === 'auto' || style.overflow === 'scroll') {
                    return element;
                }
                element = element.parentElement;
            }
            return null;
        };

        const scrollContainer = findScrollingContainer();
        const isWindow = !scrollContainer;

        const handleScroll = () => {
            const currentScrollY = isWindow 
                ? window.scrollY 
                : scrollContainer.scrollTop;

            // Only toggle states if we've scrolled a bit to avoid jitter
            if (currentScrollY < 10) {
                setIsVisible(true);
                lastScrollY.current = currentScrollY;
                return;
            }

            if (currentScrollY > lastScrollY.current) {
                // Scrolling down
                setIsVisible(false);
            } else {
                // Scrolling up
                setIsVisible(true);
            }
            lastScrollY.current = currentScrollY;
        };

        if (isWindow) {
            window.addEventListener('scroll', handleScroll, { passive: true });
            return () => window.removeEventListener('scroll', handleScroll);
        } else {
            scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
            return () => scrollContainer.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className={`sticky top-0 z-50 bg-brand-white transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'
                } ${className}`}
            style={{ position: 'sticky' } as React.CSSProperties}
        >
            {children}
        </div>
    );
}
