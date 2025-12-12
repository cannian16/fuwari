<script>
  import CardBentEdgeFixed from './CardComponent.svelte';
  import { onMount, onDestroy } from 'svelte';
  
  export let cards = [];
  export let gap = 6;
  export let snap = true;
  
  let container;
  let isDragging = false;
  let startX;
  let scrollLeft;
  let velocity = 0;
  let animationFrame;
  let currentFocusIndex = 0;
  
  const handleMouseDown = (e) => {
    isDragging = true;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
    container.style.cursor = 'grabbing';
    e.preventDefault();
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
    velocity = (scrollLeft - container.scrollLeft) / 10;
  };
  
  const handleMouseUp = () => {
    isDragging = false;
    container.style.cursor = '';
    applyInertia();
  };
  
  const applyInertia = () => {
    if (Math.abs(velocity) < 0.1) {
      velocity = 0;
      return;
    }
    
    container.scrollLeft += velocity;
    velocity *= 0.95;
    animationFrame = requestAnimationFrame(applyInertia);
  };
  
  const handleWheel = (e) => {
    e.preventDefault();
    container.scrollLeft += e.deltaY * 1.5;
  };
  
  const handleKeyDown = (e) => {
    if (!container) return;
    
    const cardItems = container.querySelectorAll('.card-item');
    const cardWidth = cardItems[0]?.offsetWidth || 300;
    const gapPx = gap * 4;
    const scrollAmount = cardWidth + gapPx;
    
    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        currentFocusIndex = Math.max(0, currentFocusIndex - 1);
        focusCard(currentFocusIndex);
        break;
        
      case 'ArrowRight':
        e.preventDefault();
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        currentFocusIndex = Math.min(cards.length - 1, currentFocusIndex + 1);
        focusCard(currentFocusIndex);
        break;
        
      case 'Home':
        e.preventDefault();
        container.scrollTo({ left: 0, behavior: 'smooth' });
        currentFocusIndex = 0;
        focusCard(currentFocusIndex);
        break;
        
      case 'End':
        e.preventDefault();
        container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
        currentFocusIndex = cards.length - 1;
        focusCard(currentFocusIndex);
        break;
        
      case 'Enter':
      case ' ':
        if (document.activeElement === container) {
          e.preventDefault();
          focusCard(currentFocusIndex);
        }
        break;
    }
  };
  
  const focusCard = (index) => {
    const cardItems = container.querySelectorAll('.card-item');
    if (cardItems[index]) {
      const cardLink = cardItems[index].querySelector('a');
      if (cardLink) {
        cardLink.focus();
      } else {
        cardItems[index].setAttribute('tabindex', '-1');
        cardItems[index].focus();
      }
    }
  };
  
  const handleCardClick = () => {
    if (container) {
      container.focus();
    }
  };
  
  const scrollToCard = (index) => {
    if (!container || index < 0 || index >= cards.length) return;
    
    const cardItems = container.querySelectorAll('.card-item');
    const cardWidth = cardItems[0]?.offsetWidth || 300;
    const gapPx = gap * 4;
    const targetScroll = index * (cardWidth + gapPx);
    
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
    
    currentFocusIndex = index;
    focusCard(index);
  };
  
  const cancelAnimation = () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  };
  
  const getActiveCardIndex = () => {
    if (!container) return 0;
    
    const cardItems = container.querySelectorAll('.card-item');
    if (cardItems.length === 0) return 0;
    
    const cardWidth = cardItems[0].offsetWidth;
    const gapPx = gap * 4;
    const itemWidth = cardWidth + gapPx;
    
    return Math.round(container.scrollLeft / itemWidth);
  };
  
  const handleScroll = () => {
    currentFocusIndex = getActiveCardIndex();
  };
  
  onMount(() => {
    if (container) {
      container.addEventListener('scroll', handleScroll);
      
      container.style.overflowX = 'auto';
      container.style.scrollBehavior = 'smooth';
      
      setTimeout(() => {
        if (container) {
          container.focus();
          container.dispatchEvent(new Event('scroll'));
        }
      }, 100);
    }
  });
  
  onDestroy(() => {
    cancelAnimation();
    if (container) {
      container.removeEventListener('scroll', handleScroll);
    }
  });
</script>

<div class="relative group top-4">
  <section
    bind:this={container}
    class="flex overflow-x-auto scroll-smooth outline-none"
    class:cursor-grab={!isDragging}
    class:cursor-grabbing={isDragging}
    class:snap-x={snap}
    class:snap-mandatory={snap}
    style="gap: {gap * 0.25}rem;"
    on:mousedown={handleMouseDown}
    on:mousemove={handleMouseMove}
    on:mouseup={handleMouseUp}
    on:mouseleave={handleMouseUp}
    on:wheel={handleWheel}
    on:keydown={handleKeyDown}
    role="region"
    tabindex="0"
    aria-label="可水平滚动的卡片列表"
  >
    {#each cards as card, index}
      <article 
        class="flex-shrink-0 card-item" 
        style="scroll-snap-align: {snap ? 'start' : 'none'};"
        on:click={handleCardClick}
        tabindex="-1"
        aria-label={`卡片 ${index + 1}: ${card.title}`}
      >
        <CardBentEdgeFixed
          imgUrl={card.imgUrl}
          title={card.title}
          url={card.url}
          subtitle={card.subtitle}
          content={card.content}
          size={card.size || 'medium'}
        />
      </article>
    {/each}
  </section>

  <div class="sr-only">
    使用滚轮、方向键或鼠标拖动进行水平滚动
  </div>

</div>

<style>
  section[role="region"] {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    
    /* 隐藏滚动条 */
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;     /* Firefox */
  }
  
  section[role="region"]::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }
  
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>