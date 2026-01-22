// 图标组件库
import { h } from "vue";

// 所有图标使用h()函数创建，确保能正确作为动态组件使用

export const HomeIcon = (props) =>
  h(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      class: `w-5 h-5 ${props.class || ''}`
    },
    [h("path", { d: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" })],
  );

export const ExploreIcon = (props) =>
  h(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      class: `w-5 h-5 ${props.class || ''}`
    },
    [
      h("path", {
        d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z",
      }),
    ],
  );

export const ProfileIcon = (props) =>
  h(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      class: `w-5 h-5 ${props.class || ''}`
    },
    [
      h("path", {
        d: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
      }),
    ],
  );

export const SettingsIcon = (props) =>
  h(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      class: `w-5 h-5 ${props.class || ''}`
    },
    [
      h("path", {
        d: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
      }),
    ],
  );

export const FireIcon = (props) =>
  h(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      class: `w-5 h-5 ${props.class || ''}`
    },
    [
      h("path", {
        d: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z",
      }),
      h("path", {
        d: "M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z",
      }),
    ],
  );

export const CalendarIcon = (props) =>
  h(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      class: `w-5 h-5 ${props.class || ''}`
    },
    [
      h("path", {
        d: "M3 17v-2c0-1.1.9-2 2-2h4c1.1 0 2-.9 2-2V7c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v4c0 1.1.9 2 2 2h4c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2zm18-4h-2v-4h-4V9h4V5h2v4h4v2h-4v4z",
      }),
    ],
  );

export const ShareIcon = (props) =>
  h(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      class: `w-5 h-5 ${props.class || ''}`
    },
    [
      h("path", {
        d: "M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z",
      }),
    ],
  );

export const BookIcon = (props) =>
  h(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      class: `w-5 h-5 ${props.class || ''}`
    },
    [
      h("path", {
        d: "M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h12v16H6V4zm9 6H9v2h6v-2zm0 4H9v2h6v-2z",
      }),
    ],
  );

export const BookOpenIcon = (props) =>
  h(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      class: `w-5 h-5 ${props.class || ''}`
    },
    [
      h("path", {
        d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
      }),
    ],
  );

export const ToolsIcon = (props) =>
  h(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      class: `w-5 h-5 ${props.class || ''}`
    },
    [
      h("path", {
        d: "M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83zM3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM16.79 15.36L7.76 6.33 4.02 10.07 12.01 18H4v-3.75l9.79-9.79 3 3z",
      }),
    ],
  );

export const CheckIcon = (props) =>
  h(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      class: `w-5 h-5 ${props.class || ''}`
    },
    [
      h("path", {
        d: "M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z",
      }),
    ],
  );

export const ClockIcon = (props) =>
  h(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      class: `w-5 h-5 ${props.class || ''}`
    },
    [
      h("path", {
        d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z",
      }),
    ],
  );

export const GiftIcon = (props) =>
  h(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      class: `w-5 h-5 ${props.class || ''}`
    },
    [
      h("path", {
        d: "M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z",
      }),
    ],
  );

export const CloseIcon = (props) =>
  h(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      class: `w-5 h-5 ${props.class || ''}`
    },
    [
      h("path", {
        d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z",
      }),
    ],
  );

export const ArrowLeftIcon = (props) =>
  h(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      class: `w-5 h-5 ${props.class || ''}`
    },
    [
      h("path", {
        d: "M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z",
      }),
    ],
  );

export const ArrowRightIcon = (props) =>
  h(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      class: `w-5 h-5 ${props.class || ''}`
    },
    [
      h("path", {
        d: "M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z",
      }),
    ],
  );

export const PlayIcon = (props) =>
  h(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      class: `w-5 h-5 ${props.class || ''}`
    },
    [
      h("path", {
        d: "M8 5v14l11-7z",
      }),
    ],
  );

export const PauseIcon = (props) =>
  h(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      class: `w-5 h-5 ${props.class || ''}`
    },
    [
      h("path", {
        d: "M6 19h4V5H6v14zm8-14v14h4V5h-4z",
      }),
    ],
  );

export const VolumeIcon = (props) =>
  h(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      class: `w-5 h-5 ${props.class || ''}`
    },
    [
      h("path", {
        d: "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z",
      }),
    ],
  );

export const MuteIcon = (props) =>
  h(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      class: `w-5 h-5 ${props.class || ''}`
    },
    [
      h("path", {
        d: "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z",
      }),
    ],
  );

// 重点重新设计的五个图标
// 提示图标
export const LightbulbIcon = (props) =>
  h(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      class: `w-5 h-5 ${props.class || ''}`
    },
    [
      h("path", {
        d: "M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 017 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z",
      }),
    ],
  );

// 重新学习图标
export const RefreshIcon = (props) =>
  h(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      class: `w-5 h-5 ${props.class || ''}`
    },
    [
      h("path", {
        d: "M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z",
      }),
    ],
  );

// 重播图标
export const ReplayIcon = (props) =>
  h(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 1024 1024",
      xmlns: "http://www.w3.org/2000/svg",
      class: `w-5 h-5 stroke-2 ${props.class || ''}`
    },
    [
      h("path", {
        d: "M784 371.2c-16-25.6-35.2-44.8-44.8-54.4-9.6-9.6-28.8-9.6-38.4 3.2-9.6 9.6-9.6 28.8 3.2 38.4 3.2 3.2 6.4 6.4 9.6 9.6 9.6 9.6 19.2 22.4 25.6 35.2 57.6 86.4 57.6 179.2-38.4 278.4-9.6 9.6-9.6 28.8 0 38.4 9.6 9.6 28.8 9.6 38.4 0C851.2 598.4 851.2 476.8 784 371.2z",
      }),
      h("path", {
        d: "M896 246.4c-16-25.6-35.2-48-54.4-70.4-9.6-12.8-19.2-19.2-25.6-25.6-9.6-9.6-28.8-9.6-38.4 3.2-9.6 9.6-9.6 28.8 3.2 38.4 3.2 3.2 12.8 9.6 22.4 22.4 16 19.2 32 38.4 48 64 105.6 160 105.6 336-70.4 518.4-9.6 9.6-9.6 28.8 0 38.4 9.6 9.6 28.8 9.6 38.4 0C1014.4 630.4 1014.4 425.6 896 246.4z",
      }),
      h("path", {
        d: "M483.2 86.4l-217.6 185.6-108.8 0c-57.6 0-108.8 48-108.8 108.8l0 272c0 60.8 48 108.8 108.8 108.8l96 0 230.4 182.4c54.4 41.6 105.6 16 105.6-51.2l0-755.2C588.8 67.2 534.4 41.6 483.2 86.4zM534.4 889.6c0 22.4-3.2 22.4-19.2 9.6l-236.8-185.6c-3.2-3.2-9.6-6.4-16-6.4l-105.6 0c-28.8 0-54.4-25.6-54.4-54.4l0-272c0-28.8 25.6-54.4 54.4-54.4l118.4 0c6.4 0 12.8-3.2 16-6.4l224-192c16-12.8 16-12.8 16 6.4L531.2 889.6z",
      }),
    ],
  );

// 跳过图标
export const ForwardIcon = (props) => {
  return h(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 1024 1024",
      xmlns: "http://www.w3.org/2000/svg",
      class: `w-5 h-5 stroke-2 ${props.class || ''}`
    },
    [
      h("path", {
        d: "M512 128a384 384 0 1 1-384 384 384.426667 384.426667 0 0 1 384-384m0-64a448 448 0 1 0 448 448 448 448 0 0 0-448-448z"
      }),
      h("path", {
        d: "M680 482.666667h-352a32 32 0 0 0 0 64h352v-64z"
      }),
      h("path", {
        d: "M535.52 317.066667a31.093333 31.093333 0 0 0-21.333333 8.373333 32 32 0 0 0-0.693334 45.92l143.2 143.306667-142.4 142.346666a32.906667 32.906667 0 0 0-1.6 45.493334 32 32 0 0 0 45.92 0.746666L701.92 560a64 64 0 0 0 0-90.666667l-142.346667-142.293333a34.133333 34.133333 0 0 0-24.053333-9.973333z"
      })
    ]
  );
};

// 提交图标
export const CheckCircleIcon = (props) => {
  return h(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      class: `w-5 h-5 ${props.class || ''}`
    },
    [
      h("path", {
        d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
      })
    ]
  );
};