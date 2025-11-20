<script>
  import techStackData from '../content/spec/techStack.json';
  
  export let speed = 35;
  let isPaused = false;
  
  // 直接处理数据，不需要 isMounted
  $: rows = techStackData.displayOrder.map(categoryKey => {
    const category = techStackData.categories[categoryKey];
    return {
      name: category.name,
      items: [...category.items, ...category.items]
    };
  });
</script>

<div class="w-full bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-4">
  {#each rows as row, rowIndex}
    <div class="relative overflow-hidden">
      <div class="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent z-10"></div>
      <div class="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent z-10"></div>
      
      <!-- 直接添加 animate-scroll 类 -->
      <div 
        class="flex space-x-4 animate-scroll {isPaused ? 'paused' : ''}"
        style="--scroll-duration: {speed + rowIndex * 5}s; --scroll-direction: {rowIndex % 2 === 0 ? 'normal' : 'reverse'}"
        role="marquee"
        on:mouseenter={() => isPaused = true}
        on:mouseleave={() => isPaused = false}
      >
        {#each row.items as item}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            class="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 min-w-[80px] group flex-shrink-0"
            title={item.name}
          >
            <img
              src={item.logo}
              alt={item.name}
              class="w-12 h-12 object-contain grayscale-50 group-hover:grayscale-0 transition-all"
              loading="lazy"
            />
          </a>
        {/each}
      </div>
    </div>
  {/each}
</div>

<style global>
  @keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  
  .animate-scroll {
    animation: scroll var(--scroll-duration, 40s) linear infinite var(--scroll-direction, normal);
    width: max-content;
  }
  
  .paused {
    animation-play-state: paused;
  }
</style>