<script>
import { onMount } from "svelte";
import api from "@lib/api";

let loading = false;
let error = "";
let links = [];
// 友情链接数据
async function fetchLinks() {
    loading = true;
    error = "";
    try {
        const response = await api.get("links/get");
        links = response.data;
    } catch (err) {
		if (err.response) {
			error = `获取友链失败: ${err.response.data.error || err.response.status}`;
		} else if (err.request) {
			error = "网络错误，无法连接到服务器";
		} else {
			error = `请求发出失败: ${err.message}`;
		}
		console.error("获取友链列表失败:", err);
    } finally {
        loading = false;
    }
}

//组件挂载时获取友链数据
onMount(() => {
	fetchLinks();
});
</script>

{#if error}
    <div class="text-red-500 text-sm mb-4">{error}</div>
{/if}

{#if loading}
    <div class="text-center py-8">加载中...</div>
{:else if links.length === 0}
    <div class="text-center py-8">暂无友链</div>
{:else}
    <div class="flex w-full rounded-[var(--radius-large)] overflow-hidden relative min-h-32">
        <div class="card-base z-10 px-9 py-6 relative w-full ">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8 my-4">
                {#each links as link}
                    <div class="flex flex-nowrap items-stretch h-28 gap-4 rounded-[var(--radius-large)]">
                        <div class="w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-900">
                            <img src={link.icon} alt={`${link.name}的头像`} class="w-full h-full object-cover">
                        </div>
                        <div class="grow w-full">
                            <div class="font-bold transition text-lg text-neutral-900 dark:text-neutral-100 mb-1">{link.name}</div>
                            <div class="text-50 text-sm font-medium">{link.description}</div>
                        </div>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`访问 ${link.name} 的网站`} class="flex btn-regular w-[3.25rem] rounded-lg bg-[var(--enter-btn-bg)] hover:bg-[var(--enter-btn-bg-hover)] active:bg-[var(--enter-btn-bg-active)] active:scale-95">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="transition text-[var(--primary)] text-4xl mx-auto iconify iconify--material-symbols" width="1em" height="1em" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7z"></path>
                            </svg>
                        </a>
                    </div>
                {/each}
            </div>
            <div class="mt-8 text-center">
                <p class="text-sm text-neutral-600 dark:text-neutral-400">虚位以待</p>
            </div>
        </div>
    </div>
{/if}