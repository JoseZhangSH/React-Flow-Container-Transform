import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import type { TransitionState } from '../types';

interface TransitionLayerProps {
  transition: TransitionState;
  onComplete: () => void;
}

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function TransitionLayer({ transition, onComplete }: TransitionLayerProps) {
  const { rect, isExpanding, nodeData, fromNodeId } = transition;
  const [targetRect, setTargetRect] = useState<Rect | null>(null);

  // Use a unique key for each transition to ensure fresh mounting
  const transitionKey = fromNodeId ? `${fromNodeId}-${isExpanding}` : null;

  useEffect(() => {
    if (!isExpanding && fromNodeId) {
      let attempts = 0;
      const findNode = () => {
        // Try multiple ways to find the node
        const allNodes = document.querySelectorAll('.react-flow__node');
        let nodeElement = null;
        for (const node of Array.from(allNodes)) {
          if (node.getAttribute('data-id') === fromNodeId) {
            nodeElement = node;
            break;
          }
        }
        
        if (!nodeElement) {
          nodeElement = document.querySelector(`[data-id="${fromNodeId}"]`);
        }

        const container = document.querySelector('.app-container');
        
        if (nodeElement && container) {
          const nRect = nodeElement.getBoundingClientRect();
          const cRect = container.getBoundingClientRect();
          
          // Basic validation that the rect is not zero
          if (nRect.width > 0 && nRect.height > 0) {
            setTargetRect({
              left: nRect.left - cRect.left,
              top: nRect.top - cRect.top,
              width: nRect.width,
              height: nRect.height
            });
            return; // Success
          }
        }
        
        if (attempts < 100) { // Even more attempts
          attempts++;
          setTimeout(findNode, 50); 
        }
      };
      
      findNode();
    } else {
      setTargetRect(null);
    }
  }, [fromNodeId, isExpanding]);

  return (
    <AnimatePresence>
      {fromNodeId && rect && (
        <motion.div
          key={transitionKey}
          initial={isExpanding ? {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
            opacity: 1,
            borderRadius: '8px',
          } : {
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            opacity: 1,
            borderRadius: '0px',
          }}
          animate={isExpanding ? {
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            opacity: 1,
            borderRadius: '0px',
          } : (targetRect ? {
            left: targetRect.left,
            top: targetRect.top,
            width: targetRect.width,
            height: targetRect.height,
            opacity: 1,
            borderRadius: '8px',
          } : {
            // Wait for targetRect
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            opacity: 1,
            borderRadius: '0px',
          })}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
          }}
          onAnimationComplete={() => {
            // Only complete if we are expanding OR if we have reached the targetRect when shrinking
            if (isExpanding || targetRect) {
              onComplete();
            }
          }}
          style={{
            position: 'absolute',
            background: '#ffffff',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            zIndex: 9999,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          <motion.div
            initial={{ opacity: isExpanding ? 1 : 0 }}
            animate={{ opacity: isExpanding ? [1, 1, 0] : [0, 1, 1] }}
            transition={{ duration: 0.4 }}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '600',
              color: '#333',
            }}
          >
            {nodeData?.label || 'Loading...'}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
