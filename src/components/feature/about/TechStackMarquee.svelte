<script>
import api from "@lib/api";
import { onMount } from "svelte";

let speed = 35;
let isPaused = false;
const rowCount = 3;
let Skills = [];
let rows = [];

async function fetchSkills() {
	try {
		const response = await api.get("skills/get");
		Skills = response.data;
	} catch (err) {
		console.error("获取技术栈数据失败:", err);
	}
}
onMount(() => {
	fetchSkills();
});

$: {
	// 1. 初始化空数组
	let tempRows = [];
	// 2. 计算每行要放几个 (math.ceil 就是 Python 的 math.ceil)
	const itemsPerRow = Math.ceil(Skills.length / rowCount);

	// 3. 传统循环
	for (let i = 0; i < rowCount; i++) {
		const start = i * itemsPerRow;
		const end = start + itemsPerRow;

		// 切片 (Python 的切片是 items[start:end])
		let chunk = Skills.slice(start, end);

		// 4. 重复一遍 (相当于 Python 的 chunk + chunk)
		let doubledChunk = [...chunk, ...chunk];

		// 5. 存入结果
		tempRows.push(doubledChunk);
	}
	rows = tempRows;
}
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
        {#each row as item}
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