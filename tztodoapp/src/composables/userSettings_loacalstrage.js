// src/composables/useSettings.js

// Vue Composition API에서 반응형 상태와 라이프사이클 훅을 가져옴
import { ref, onMounted } from 'vue';

// 사용자 설정을 다루는 커스텀 훅 정의
export function useSettings() {
  // 각각의 설정 값을 ref로 선언하여 반응형 상태로 만듦
  const theme = ref('light');           // 테마 (기본: 밝은 테마)
  const columnCount = ref('3');         // 컬럼 수 (기본: 3개)
  const fontSize = ref('2');            // 폰트 크기 단계 (기본: 2)
  const textAlign = ref('center');      // 텍스트 정렬 (기본: 가운데 정렬)
  const buttonSize = ref('3');          // 버튼 크기 단계 (기본: 3)

  // 컴포넌트가 마운트되면 localStorage에서 저장된 설정 값을 불러옴
  onMounted(() => {
    theme.value = localStorage.getItem('theme') || 'light';
    columnCount.value = localStorage.getItem('columnCount') || '3';
    fontSize.value = localStorage.getItem('fontSize') || '2';
    textAlign.value = localStorage.getItem('textAlign') || 'center';
    buttonSize.value = localStorage.getItem('buttonSize') || '3';
  });

  // 현재 상태값을 localStorage에 저장하는 함수
  function saveSettings() {
    localStorage.setItem('theme', theme.value);
    localStorage.setItem('columnCount', columnCount.value);
    localStorage.setItem('fontSize', fontSize.value);
    localStorage.setItem('textAlign', textAlign.value);
    localStorage.setItem('buttonSize', buttonSize.value);
  }

  // 외부에서 사용할 수 있도록 모든 상태와 저장 함수 반환
  return {
    theme, columnCount, fontSize, textAlign, buttonSize, saveSettings,
  };
}