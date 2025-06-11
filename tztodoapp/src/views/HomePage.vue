<template>
  <!-- 전체 페이지를 감싸는 IonPage (Ionic 기본 구조 컴포넌트) -->
  <ion-page>
    
    <!-- 상단 시간 표시 컴포넌트 -->
    <ClockBar />

    <!-- 메인 콘텐츠 영역 -->
    <MainContent>
      <!-- 자식 라우트가 이 영역에 렌더링됨 -->
      <ion-router-outlet />
    </MainContent>

    <!-- 하단 광고 바 -->
    <AdBar />

    <!-- 하단 여백 확보용 컴포넌트 (아이폰 등 홈바 공간 고려) -->
    <SafeBottomSpace />
  </ion-page>
</template>

<script setup>
// 상단 시계 표시 바
import ClockBar from '@/components/layout/ClockBar.vue'

// 콘텐츠 표시용 레이아웃 래퍼
import MainContent from '@/components/layout/MainContent.vue'

// 하단 광고 영역
import AdBar from '@/components/layout/AdBar.vue'

// 화면 하단 여유 공간 확보용 컴포넌트
import SafeBottomSpace from '@/components/layout/SafeBottomSpace.vue'

// Ionic 페이지 컨테이너 및 자식 라우터 출력 컴포넌트
import { IonPage, IonRouterOutlet } from '@ionic/vue'
</script>