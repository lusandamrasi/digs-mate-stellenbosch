import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { X, Info, Heart, RefreshCw } from "lucide-react";
import { mockSwipePosts, type SwipePost } from "@/data/mockSwipePosts";
import SwipeCard from "@/components/SwipeCard";

const SwipeScreen = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState<SwipePost[]>(mockSwipePosts);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const SWIPE_THRESHOLD = 100; // pixels to trigger swipe
  const currentCard = cards[currentIndex];
  const hasMoreCards = currentIndex < cards.length;

  // Mouse/Touch event handlers
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Check if swipe threshold is met
    if (Math.abs(dragOffset.x) > SWIPE_THRESHOLD) {
      if (dragOffset.x > 0) {
        handleSwipeRight();
      } else {
        handleSwipeLeft();
      }
    } else {
      // Snap back to center
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleSwipeLeft = () => {
    console.log('Swiped left (Pass) on:', currentCard?.poster.name);
    animateSwipe('left');
  };

  const handleSwipeRight = () => {
    console.log('Swiped right (Like) on:', currentCard?.poster.name);
    animateSwipe('right');
  };

  const animateSwipe = (direction: 'left' | 'right') => {
    const flyX = direction === 'right' ? 1000 : -1000;
    setDragOffset({ x: flyX, y: 0 });
    
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      setDragOffset({ x: 0, y: 0 });
    }, 300);
  };

  const handleShowDetails = () => {
    console.log('Show details for:', currentCard?.poster.name);
    // TODO: Open details modal
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setCards([...mockSwipePosts]);
  };

  // Calculate rotation based on drag
  const getRotation = () => {
    const maxRotation = 15;
    return (dragOffset.x / SWIPE_THRESHOLD) * maxRotation;
  };

  // Calculate opacity for like/nope indicators
  const getIndicatorOpacity = () => {
    return Math.min(Math.abs(dragOffset.x) / SWIPE_THRESHOLD, 1);
  };

  // Calculate scale for background cards
  const getCardScale = (index: number) => {
    const diff = index - currentIndex;
    return 1 - (diff * 0.05);
  };

  const getCardTranslateY = (index: number) => {
    const diff = index - currentIndex;
    return diff * 10;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gradient-primary py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-primary-foreground mb-2">
            Discover Roommates
          </h1>
          <p className="text-primary-foreground/90">
            Swipe to find your perfect match
          </p>
        </div>
      </div>

      {/* Card Stack Container */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto">
          {!hasMoreCards ? (
            // Empty State
            <div className="bg-card rounded-2xl shadow-lg p-12 text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
                <RefreshCw size={40} className="text-muted-foreground" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  No More Posts Right Now!
                </h2>
                <p className="text-muted-foreground">
                  Check back later for new listings or adjust your filters to see more
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button 
                  variant="outline"
                  onClick={handleReset}
                  className="gap-2"
                >
                  <RefreshCw size={16} />
                  Start Over
                </Button>
                <Button 
                  onClick={() => navigate('/roommates')}
                  className="bg-primary hover:opacity-90"
                >
                  Go Browse
                </Button>
              </div>
            </div>
          ) : (
            // Card Stack
            <div className="relative" style={{ height: '600px' }}>
              {/* Stack of cards */}
              {cards.slice(currentIndex, currentIndex + 3).map((card, index) => {
                const cardIndex = currentIndex + index;
                const isTopCard = index === 0;
                
                return (
                  <div
                    key={card.id}
                    ref={isTopCard ? cardRef : null}
                    className="absolute inset-0 transition-all duration-300"
                    style={{
                      transform: isTopCard
                        ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${getRotation()}deg)`
                        : `scale(${getCardScale(cardIndex)}) translateY(${getCardTranslateY(cardIndex)}px)`,
                      opacity: index === 0 ? 1 : 0.7,
                      zIndex: 10 - index,
                      pointerEvents: isTopCard ? 'auto' : 'none',
                      transition: isDragging && isTopCard ? 'none' : 'transform 0.3s ease-out',
                    }}
                    onMouseDown={(e) => isTopCard && handleDragStart(e.clientX, e.clientY)}
                    onMouseMove={(e) => isTopCard && handleDragMove(e.clientX, e.clientY)}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={(e) => isTopCard && handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
                    onTouchMove={(e) => isTopCard && handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
                    onTouchEnd={handleDragEnd}
                  >
                    {/* Like/Nope Indicators */}
                    {isTopCard && (
                      <>
                        <div 
                          className="absolute top-8 left-8 z-20 pointer-events-none"
                          style={{ opacity: dragOffset.x > 0 ? getIndicatorOpacity() : 0 }}
                        >
                          <div className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold text-2xl border-4 border-white shadow-lg rotate-12">
                            LIKE
                          </div>
                        </div>
                        
                        <div 
                          className="absolute top-8 right-8 z-20 pointer-events-none"
                          style={{ opacity: dragOffset.x < 0 ? getIndicatorOpacity() : 0 }}
                        >
                          <div className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-2xl border-4 border-white shadow-lg -rotate-12">
                            NOPE
                          </div>
                        </div>
                      </>
                    )}

                    <SwipeCard post={card} isTop={isTopCard} />
                  </div>
                );
              })}
            </div>
          )}

          {/* Action Buttons */}
          {hasMoreCards && (
            <div className="flex justify-center items-center gap-6 mt-8">
              {/* Nope Button */}
              <Button
                size="lg"
                variant="outline"
                className="w-16 h-16 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white shadow-lg"
                onClick={handleSwipeLeft}
              >
                <X size={28} />
              </Button>

              {/* Details Button */}
              <Button
                size="lg"
                variant="outline"
                className="w-14 h-14 rounded-full border-2 border-primary shadow-lg"
                onClick={handleShowDetails}
              >
                <Info size={24} />
              </Button>

              {/* Like Button */}
              <Button
                size="lg"
                variant="outline"
                className="w-16 h-16 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white shadow-lg"
                onClick={handleSwipeRight}
              >
                <Heart size={28} />
              </Button>
            </div>
          )}

          {/* Counter */}
          {hasMoreCards && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              {currentIndex + 1} of {cards.length} posts
            </p>
          )}
        </div>
      </div>

      {/* TODO Comments for Future Implementation */}
      {/* TODO: Add filter button in top right corner */}
      {/* TODO: Add undo last swipe button */}
      {/* TODO: Show match notification when both users swipe right */}
      {/* TODO: Implement "out of swipes" daily limit */}
      {/* TODO: Integrate with real post data from Supabase */}
      {/* TODO: Save swipe actions (likes/passes) to database */}
      {/* TODO: Add swipe up gesture for super like */}
      {/* TODO: Add keyboard shortcuts (left arrow = pass, right arrow = like) */}
    </div>
  );
};

export default SwipeScreen;

