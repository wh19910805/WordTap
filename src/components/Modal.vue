<template>
  <div
    v-if="visible"
    class="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity duration-200"
    @click.self="handleClose"
  >
    <div
      class="modal-container bg-white rounded-3xl shadow-xl max-w-md w-full transform transition-all duration-300 ease-out"
      :style="modalStyle"
    >
      <!-- 标题 -->
      <div v-if="title" class="modal-header px-6 py-4 border-b-2 border-[var(--border-color)]">
        <h3 class="text-xl font-bold text-[var(--text-primary)]">{{ title }}</h3>
      </div>
      
      <!-- 内容 -->
      <div class="modal-content px-6 py-5 text-[var(--text-primary)]">
        <slot></slot>
      </div>
      
      <!-- 按钮 -->
      <div class="modal-footer px-6 py-4 flex justify-end gap-3">
        <button
          v-if="showCancel"
          @click="handleCancel"
          class="px-5 py-2.5 rounded-2xl text-sm font-semibold text-[var(--text-primary)] bg-[var(--surface-color)] hover:bg-[var(--hover-color)] transition-all duration-200 active:scale-95"
        >
          {{ cancelText }}
        </button>
        <button
          @click="handleConfirm"
          class="px-5 py-2.5 rounded-2xl text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 transition-all duration-200 active:scale-95"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  }
});

// Emits
const emit = defineEmits(['close', 'confirm', 'cancel']);

// Methods
const handleClose = () => {
  emit('close');
};

const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  emit('cancel');
};

// Computed
const modalStyle = computed(() => {
  return {
    animation: props.visible ? 'modalSlideIn 0.3s ease-out' : 'modalSlideOut 0.3s ease-in'
  };
});
</script>

<style scoped>
/* Modal animations */
@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes modalSlideOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
}
</style>
