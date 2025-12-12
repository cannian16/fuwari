<script>
  export let imgUrl = '';
  export let title = '';
  export let subtitle = '';
  export let content = '';
  export let url = '';
  export let size = 'small';
  
  // 使用可靠的方案
  let isHovered = false;
  
  // 像素值配置
  const sizePx = {
    small: {
      width: 256,
      height: 256,
      expanded: 340, // 使用 384 而不是 380
      image: 240
    },
    medium: {
      width: 288,
      height: 288,
      expanded: 420,
      image: 256
    },
    large: {
      width: 320,
      height: 320,
      expanded: 460,
      image: 288
    }
  };
  
  $: config = sizePx[size] || sizePx.small;
  
  // 动态样式
  $: containerStyle = `
    width: ${config.width}px;
    height: ${isHovered ? config.expanded : config.height}px;
    transition: height 0.5s ease-out;
  `;
  
  $: imageStyle = `
    height: ${config.image}px;
    background-image: url('${imgUrl}');
    filter: ${isHovered ? 'blur(0)' : 'blur(25px)'};
    background-size: ${isHovered ? '110%' : '100%'};
  `;
</script>

<div
  class="relative cursor-pointer bg-white rounded-[40px] shadow-2xl overflow-hidden dark:bg-black"
  style={containerStyle}
  on:mouseenter={() => isHovered = true}
  on:mouseleave={() => isHovered = false}
  role="button" 
  tabindex="0"   
>
  <!-- 图片容器 -->
  <div
    class="relative w-full bg-center bg-cover transition-all duration-500 ease-out dark:bg-black"
    style={imageStyle}
  >
    <!-- 底部白色弯曲区域 -->
    <div class="absolute -bottom-10 w-full h-24 bg-white rounded-[40px] dark:bg-black"></div>
    
    <!-- 右侧弯曲效果 -->
    <div class=" absolute right-0 bottom-14 w-20 h-20 bg-transparent rounded-full shadow-[75px_70px_0_40px_white] dark:shadow-[75px_70px_0_40px_black]"></div>
  </div>

  <!-- 内容区域 -->
  <div class="relative -top-10 z-10 px-7 transition-all duration-500 ease-out">
    <h3 class="relative text-xl font-semibold text-gray-800 dark:text-white">
      <a href={url} target="_blank" rel="noopener noreferrer" class="hover:text-blue-600 transition-colors">
        {title}
      <br />  
      </a>
      <span class="absolute -bottom-3.5 font-normal text-xs opacity-75 ">
        {subtitle}
      </span>
    </h3>
    
    <p 
      class="relative mt-8 text-gray-800 transition-all duration-500 ease-out dark:text-gray-200"
      class:opacity-0={!isHovered}
      class:opacity-100={isHovered}
      class:translate-y-5={!isHovered}
      class:translate-y-0={isHovered}
    >
      {content}
    </p>
  </div>
</div>