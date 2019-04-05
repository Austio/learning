<template>
  <div class="row navigation nav-container">
    <nav>
      <ul>
        <li>
          <nuxt-link class="navbar-link" to="/controlled_component">
            Controlled Component
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/global_management">
            Modal Global Events
          </nuxt-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: "AppMast"
};
</script>
