import { ref, reactive, nextTick } from "vue";
import Modal from "@/components/Modal.vue";

// 全局弹窗状态
const modals = reactive({
  confirm: {
    visible: false,
    title: "",
    message: "",
    confirmText: "确定",
    cancelText: "取消",
    showCancel: true,
    resolve: null,
  },
  alert: {
    visible: false,
    title: "",
    message: "",
    confirmText: "确定",
    showCancel: false,
    resolve: null,
  },
});

// 全局弹窗配置
const modalConfig = reactive({
  confirm: {
    title: "确认",
    confirmText: "确定",
    cancelText: "取消",
    showCancel: true,
  },
  alert: {
    title: "提示",
    confirmText: "确定",
    showCancel: false,
  },
});

// 注册全局弹窗组件
let isRegistered = false;
function registerModal(app) {
  if (!isRegistered) {
    app.component("Modal", Modal);
    app.config.globalProperties.$confirm = confirm;
    app.config.globalProperties.$alert = alert;
    isRegistered = true;
  }
}

// 确认弹窗
function confirm(message, title, options = {}) {
  return new Promise((resolve) => {
    const config = {
      ...modalConfig.confirm,
      ...options,
    };
    modals.confirm = {
      visible: true,
      title: title || config.title,
      message,
      confirmText: options.confirmText || config.confirmText,
      cancelText: options.cancelText || config.cancelText,
      showCancel:
        options.showCancel !== undefined
          ? options.showCancel
          : config.showCancel,
      resolve,
    };
  });
}

// 提示弹窗
function alert(message, title, options = {}) {
  return new Promise((resolve) => {
    const config = {
      ...modalConfig.alert,
      ...options,
    };
    modals.alert = {
      visible: true,
      title: title || config.title,
      message,
      confirmText: options.confirmText || config.confirmText,
      showCancel: false,
      resolve,
    };
  });
}

// 关闭弹窗
function closeModal(type) {
  if (modals[type]) {
    modals[type].visible = false;
    if (modals[type].resolve) {
      modals[type].resolve(false);
      modals[type].resolve = null;
    }
  }
}

// 确认弹窗
function confirmModal() {
  if (modals.confirm.resolve) {
    modals.confirm.resolve(true);
    modals.confirm.resolve = null;
    modals.confirm.visible = false;
  }
}

// 取消弹窗
function cancelModal() {
  if (modals.confirm.resolve) {
    modals.confirm.resolve(false);
    modals.confirm.resolve = null;
    modals.confirm.visible = false;
  }
}

// 确定弹窗
function okModal() {
  if (modals.alert.resolve) {
    modals.alert.resolve(true);
    modals.alert.resolve = null;
    modals.alert.visible = false;
  }
}

// 替换浏览器默认弹窗
function replaceBrowserModals() {
  // 保存原始弹窗函数
  window.originalConfirm = window.confirm;
  window.originalAlert = window.alert;

  // 替换为自定义弹窗
  window.confirm = (message, title, options) => {
    return confirm(message, title, options);
  };

  window.alert = (message, title, options) => {
    return alert(message, title, options);
  };
}

export {
  modals,
  confirm,
  alert,
  closeModal,
  confirmModal,
  cancelModal,
  okModal,
  registerModal,
  replaceBrowserModals,
};
