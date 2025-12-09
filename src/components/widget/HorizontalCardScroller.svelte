<!-- HorizontalCardScroller.svelte -->
<script>
  import CardBentEdgeFixed from './CardComponent.svelte';
  
  export let cards = []; // 卡片数据数组
  export let gap = 6; // 卡片间距
  export let showScrollbar = true; // 是否显示滚动条
  export let snap = true; // 是否启用吸附滚动
  
  let container;
  let isDragging = false;
  let startX;
  let scrollLeft;
  let velocity = 0;
  let animationFrame;
  
  // 鼠标拖动功能
  const handleMouseDown = (e) => {
    isDragging = true;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
    container.style.cursor = 'grabbing';
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2; // 滚动速度因子
    container.scrollLeft = scrollLeft - walk;
    
    // 计算速度用于惯性滚动
    velocity = (scrollLeft - container.scrollLeft) / 10;
  };
  
  const handleMouseUp = () => {
    isDragging = false;
    container.style.cursor = 'grab';
    
    // 应用惯性滚动
    applyInertia();
  };
  
  // 惯性滚动
  const applyInertia = () => {
    if (Math.abs(velocity) < 0.1) {
      velocity = 0;
      return;
    }
    
    container.scrollLeft += velocity;
    velocity *= 0.95; // 摩擦系数
    
    animationFrame = requestAnimationFrame(applyInertia);
  };
  
  // 鼠标滚轮滚动
  const handleWheel = (e) => {
    e.preventDefault();
    container.scrollLeft += e.deltaY * 0.5;
  };
  
  // 清除动画帧
  const cancelAnimation = () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  };
  
  // 滚动到特定卡片
  const scrollToCard = (index) => {
    if (!container || index < 0 || index >= cards.length) return;
    
    const cardWidth = container.querySelector('.card-item')?.offsetWidth || 300;
    const gapPx = gap * 4; // Tailwind gap转换为px
    const targetScroll = index * (cardWidth + gapPx);
    
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };
  
  // 组件卸载时清理
  import { onDestroy } from 'svelte';
  onDestroy(cancelAnimation);
</script>

<div class="relative group top-4">
  <!-- 滚动容器 -->
  <div
    bind:this={container}
    class="flex overflow-x-auto scroll-smooth"
    class:cursor-grab={!isDragging}
    class:cursor-grabbing={isDragging}
    class:snap-x={snap}
    class:snap-mandatory={snap}
    class:scrollbar-thin={showScrollbar}
    class:scrollbar-thumb-gray-300={showScrollbar}
    class:scrollbar-track-transparent={showScrollbar}
    style="gap: {gap * 0.25}rem;"
    on:mousedown={handleMouseDown}
    on:mousemove={handleMouseMove}
    on:mouseup={handleMouseUp}
    on:mouseleave={handleMouseUp}
    on:wheel={handleWheel}
    role="region"
    aria-label="可水平滚动的卡片列表"
  >
    {#each cards as card, index}
      <div class="flex-shrink-0 card-item" style="scroll-snap-align: {snap ? 'start' : 'none'};">
        <CardBentEdgeFixed
          imgUrl={card.imgUrl}
          title={card.title}
          url={card.url}
          subtitle={card.subtitle}
          content={card.content}
          size={card.size || 'medium'}
        />
      </div>
    {/each}
  </div>
  
  <!-- 导航按钮（大屏幕显示） -->
  <button
    class="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100 z-10"
    on:click={() => container.scrollBy({ left: -400, behavior: 'smooth' })}
    aria-label="向左滚动"
  >
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
  
  <button
    class="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100 z-10"
    on:click={() => container.scrollBy({ left: 400, behavior: 'smooth' })}
    aria-label="向右滚动"
  >
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
  </button>
  
  <!-- 滚动指示器 -->
  {#if cards.length > 1}
    <div class="flex justify-center gap-2 mt-4">
      {#each cards as _, index}
        <button
          class="w-2 h-2 rounded-full transition-all duration-300 bg-gray-300 hover:bg-gray-400"
          class:bg-blue-500={Math.abs(container?.scrollLeft / (container?.scrollWidth - container?.clientWidth) * cards.length - index) < 0.5}
          class:w-4={Math.abs(container?.scrollLeft / (container?.scrollWidth - container?.clientWidth) * cards.length - index) < 0.5}
          on:click={() => scrollToCard(index)}
          aria-label={`跳转到第 ${index + 1} 个卡片`}
        />
      {/each}
    </div>
  {/if}
</div>

<style>
  /* 自定义滚动条样式 */
  .scrollbar-thin {
    scrollbar-width: thin;
  }
  
  .scrollbar-thin::-webkit-scrollbar {
    height: 6px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: rgba(209, 213, 219, 0.5);
    border-radius: 3px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background-color: rgba(156, 163, 175, 0.7);
  }
  
  /* 隐藏滚动条但保持可滚动 */
  .scrollbar-none {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-none::-webkit-scrollbar {
    display: none;
  }
</style>