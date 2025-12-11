<!-- MessageBoard.svelte -->
<script>
import axios from "axios";
import { onMount } from "svelte";

// API 基础 URL - 根据你的实际部署情况修改
const API_BASE = "https://api.cannian.space/messages";

// 创建 axios 实例
const api = axios.create({
	baseURL: API_BASE,
	timeout: 10000,
});

// 状态变量
let messages = [];
let pagination = {
	page: 1,
	limit: 20,
	total: 0,
	pages: 0,
};
let loading = false;
let submitting = false;
let error = "";
let success = "";

// 表单数据
let formData = {
	username: "",
	website_url: "",
	content: "",
	email: "",
};

// 查询条件
let searchUsername = "";

// 获取留言列表
async function fetchMessages(page = 1) {
	loading = true;
	error = "";

	try {
		const params = {
			page,
			limit: pagination.limit,
		};

		const response = await api.get("/get", { params });

		messages = response.data.messages;
		pagination = response.data.pagination;
	} catch (err) {
		if (err.response) {
			error = `获取留言失败: ${err.response.data.error || err.response.status}`;
		} else if (err.request) {
			error = "网络错误，无法连接到服务器";
		} else {
			error = `请求错误: ${err.message}`;
		}
		console.error("获取留言列表失败:", err);
	} finally {
		loading = false;
	}
}

// 提交留言
async function submitMessage() {
	submitting = true;
	error = "";
	success = "";

	try {
		const response = await api.post("/add", formData);

		// 清空表单
		formData = {
			username: "",
			website_url: "",
			content: "",
		};

		success = "留言提交成功！";

		// 重新获取留言列表，显示最新留言
		fetchMessages(1);
	} catch (err) {
		if (err.response) {
			error = err.response.data.error || "提交留言失败";
		} else if (err.request) {
			error = "网络错误，无法连接到服务器";
		} else {
			error = `请求错误: ${err.message}`;
		}
		console.error("提交留言失败:", err);
	} finally {
		submitting = false;
	}
}

// 搜索留言
function handleSearch() {
	fetchMessages(1);
}

// 分页处理
function handlePageChange(page) {
	if (page >= 1 && page <= pagination.pages) {
		fetchMessages(page);
	}
}

// 格式化日期
function formatDate(dateString) {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat("zh-CN", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
}

// 组件挂载时获取留言
onMount(() => {
	fetchMessages();
});
// 留言背景色数组
const messageColorClasses = [
	"bg-[oklch(0.9923_0.0159_98.99)] dark:bg-[oklch(0.3_0.03_98.99)]",
	"bg-[oklch(0.9735_0.0129_17.38)] dark:bg-[oklch(0.3_0.03_17.38)]",
	"bg-[oklch(0.9656_0.0171_248.01)] dark:bg-[oklch(0.3_0.035_248.01)]",
	"bg-[oklch(0.9783_0.0067_295.45)] dark:bg-[oklch(0.3_0.025_295.45)]",
];

function getMessageColorClass(index) {
	return messageColorClasses[index % messageColorClasses.length];
}
</script>

<div class="message-board">
  <!-- 错误和成功消息 -->
  {#if error}
    <div class="alert error">
      {error}
    </div>
  {/if}
  
  {#if success}
    <div class="alert success">
      {success}
    </div>
  {/if}
  
  <!-- 留言表单 -->
  <div class="message-form">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-8 my-4">
      <div class="flex w-full h-8">
        <label for="username" class="w-16 flex items-center justify-center text-black dark:text-[#C5C7C8] pl-2 pr-2 mr-0 border-r-0 rounded-lg rounded-r-none bg-[var(--btn-regular-bg)] border border-gray-300 dark:border-gray-600">昵称</label>
        <input
          type="text" 
          id="username"
          bind:value={formData.username}
          maxlength="50"
          required
          placeholder="必填"
          class="w-full pl-1 border-l-1 rounded-l-none placeholder:text-sm rounded-lg bg-[var(--btn-regular-bg)] hover:bg-[var(--btn-regular-bg-hover)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:ring-inset border border-gray-300  dark:border-gray-600"
        />
      </div>
      <div class="flex w-full h-8">
        <label for="website_url" class="w-16 flex items-center justify-center text-black dark:text-[#C5C7C8] pl-2 pr-2 mr-0 border-r-0 rounded-lg rounded-r-none bg-[var(--btn-regular-bg)] border border-gray-300 dark:border-gray-600">邮箱</label>
        <input 
          type="email" 
          id="email"
          bind:value={formData.email}
          placeholder="必填"
          class="w-full pl-1 border-l-1 rounded-l-none placeholder:text-sm rounded-lg bg-[var(--btn-regular-bg)] hover:bg-[var(--btn-regular-bg-hover)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:ring-inset border border-gray-300  dark:border-gray-600"
        />
      </div>
      <div class="flex w-full h-8">
        <label for="website_url" class="w-16 flex items-center justify-center text-black dark:text-[#C5C7C8] pl-2 pr-2 mr-0 border-r-0 rounded-lg rounded-r-none bg-[var(--btn-regular-bg)] border border-gray-300 dark:border-gray-600">网址</label>
        <input 
          type="url" 
          id="website_url"
          bind:value={formData.website_url}
          placeholder="https://example.com"
          class="w-full pl-1 border-l-1 rounded-l-none placeholder:text-sm rounded-lg bg-[var(--btn-regular-bg)] hover:bg-[var(--btn-regular-bg-hover)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:ring-inset border border-gray-300  dark:border-gray-600"
        />
      </div>
    </div>
    <form on:submit|preventDefault={submitMessage}>
      <div class="form-group my-8 sm:my-4">
        <textarea 
          id="content"
          bind:value={formData.content}
          maxlength="200"
          rows="4"
          required
          placeholder="很高兴遇见你，发个留言，留下足迹ヾ(•ω•`)o"
          class="w-full h-20 pl-1 rounded-lg bg-[var(--btn-regular-bg)] hover:bg-[var(--btn-regular-bg-hover)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent border border-gray-300 dark:border-gray-600"
        ></textarea>
      </div>
      
      <div class="flex justify-end mt-2">
        <button type="submit" disabled={submitting} class="btn-regular rounded-lg w-[5rem] border border-gray-300 dark:border-gray-600">
          {submitting ? '提交中...' : '提交留言'}
        </button> 
      </div>
    </form>
  </div>
  
  <!-- 留言列表 -->
  <div class="messages-section">
    <h1 class="text-2xl dark:text-[#C5C7C8]">{pagination.total}条留言</h1>
    
    {#if loading}
      <div class="loading">加载中...</div>
    {:else if messages.length === 0}
      <div class="no-messages">暂无留言</div>
    {:else} 
      <div class="messages-list">
        {#each messages as message,index (message.id)}
          <div class="flex gap-4 p-4 rounded-lg my-4 {getMessageColorClass(index)}">
            <div class="flex-shrink-0">
              {#if message.website_url}
                <div class="my-3 w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  <a href={message.website_url} target="_blank" rel="noopener noreferrer">
                  <img 
                    src="https://weavatar.com/avatar/{message.email_hash}" 
                    alt="头像"
                    class="w-full h-full object-cover"
                  >
                  </a>
                </div>
              {:else}
                <div class="my-3 w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://weavatar.com/avatar/{message.email_hash}" 
                    alt="头像"
                    class="w-full h-full object-cover"
                  >
                </div>
              {/if}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-2">
                {#if message.website_url}
                  <a 
                    href={message.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="dark:text-[#C5C7C8] text-2xl font-bold hover:text-[var(--primary)] dark:hover:text-[var(--primary)] "
                  >
                    {message.username}
                  </a>
                {:else}
                  <span class="dark:text-[#C5C7C8] text-2xl font-bold">{message.username}</span>
                {/if}
                <span class="dark:text-[#C5C7C8] text-sm text-[var(--deep-text)]">{formatDate(message.created_at)}</span>
              </div>
              <div class="dark:text-[#C5C7C8] text-[var(--deep-text)] leading-relaxed break-words whitespace-pre-wrap overflow-hidden">
                {message.content}
              </div>
            </div>

          </div>
        {/each}
      </div>
      
      <!-- 分页控件 -->
      {#if pagination.pages > 1}
        <div class="flex flex-row gap-3 justify-center">
          <button 
            class="btn-card overflow-hidden rounded-lg text-[var(--primary)] w-11 h-11" 
            class:disabled={pagination.page === 1}
            disabled={pagination.page === 1}
            on:click={() => handlePageChange(pagination.page - 1)}
            title="上一页"
          >
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              class="text-[1.75rem]"
            >
              <path d="m14 18-6-6 6-6 1.4 1.4-4.6 4.6 4.6 4.6Z"/>
            </svg>
          </button>
          
          <span class="transition flex items-center justify-center bg-[var(--card-bg)] rounded-lg text-[var(--primary)] w-11 h-11">
             {pagination.page} / {pagination.pages} 
          </span>
          
          <button 
            class="btn-card overflow-hidden rounded-lg text-[var(--primary)] w-11 h-11" 
            class:disabled={pagination.page === pagination.pages}
            disabled={pagination.page === pagination.pages}
            on:click={() => handlePageChange(pagination.page + 1)}
            title="下一页"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="m10 18-1.4-1.4 4.6-4.6-4.6-4.6L10 6l6 6Z"/>
            </svg>
          </button>
        </div>
      {/if}
        
    {/if}
  </div>
</div>