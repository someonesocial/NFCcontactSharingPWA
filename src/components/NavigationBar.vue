<template>
  <div class="navigation">
    <router-link to="/" class="nav-item">
      <div class="nav-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="#000" />
          <path d="M8 12C8 9.79 9.79 8 12 8" stroke="#000" stroke-width="2" />
          <path d="M7 12C7 9.24 9.24 7 12 7" stroke="#000" stroke-width="2" />
          <path d="M6 12C6 8.69 8.69 6 12 6" stroke="#000" stroke-width="2" />
        </svg>
      </div>
      Scanner
    </router-link>
    <router-link to="/contacts" class="nav-item">
      <div class="nav-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="4" stroke="#000" stroke-width="2" />
          <path d="M20 19C20 15.134 16.418 12 12 12C7.582 12 4 15.134 4 19" stroke="#000" stroke-width="2" />
        </svg>
      </div>
      Kontakte
    </router-link>
    <router-link to="/add-contact" class="nav-item">
      <div class="nav-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="#000" stroke-width="2" />
          <path d="M12 8V16" stroke="#000" stroke-width="2" />
          <path d="M8 12H16" stroke="#000" stroke-width="2" />
        </svg>
      </div>
      Meine Daten
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'NavigationBar'
}
</script>

<style scoped>
.navigation {
  display: flex;
  justify-content: space-around;
  padding: 15px 0;
  background-color: #f0f0f5;
  border-top: 1px solid #e0e0e5;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
  text-decoration: none;
  color: #000;
}

.nav-icon {
  margin-bottom: 5px;
}

.router-link-active {
  color: #2196f3;
}

.router-link-active svg path, 
.router-link-active svg circle {
  stroke: #2196f3;
  fill: #2196f3;
}
</style>