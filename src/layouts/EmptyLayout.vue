<script setup lang="ts"></script>

<template>
  <router-view v-slot="{ Component }">
    <Transition name="fade">
      <Component :is="Component" />
    </Transition>
  </router-view>
</template>
