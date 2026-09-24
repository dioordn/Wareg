<script setup>
defineProps({
  size: {
    type: String,
    default: 'md' // 'md' | 'sm'
  }
})
</script>

<template>
  <div :class="['brand-logo', `brand-${size}`]">
    <!-- Custom Logo Mark for Wareg -->
    <div class="brand-mark-wrapper">
      <img src="/logo.png" alt="Logo Wareg" class="brand-logo-img" />
    </div>

    <!-- Brand Wordmark -->
    <span class="brand-wordmark">
      Wareg
    </span>
  </div>
</template>

<style scoped>
.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  user-select: none;
}

.brand-mark-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.brand-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

/* Medium size (Navbar & Main Footer) */
.brand-md .brand-mark-wrapper {
  width: 40px;
  height: 40px;
}

.brand-md .brand-wordmark {
  font-family: 'Playfair Display', 'DM Serif Display', Georgia, serif;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.3px;
  color: var(--ink);
  line-height: 1;
}

/* Small size */
.brand-sm {
  gap: 9px;
}

.brand-sm .brand-mark-wrapper {
  width: 30px;
  height: 30px;
}

.brand-sm .brand-wordmark {
  font-family: 'Playfair Display', 'DM Serif Display', Georgia, serif;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.2px;
  color: var(--ink);
  line-height: 1;
}
</style>
