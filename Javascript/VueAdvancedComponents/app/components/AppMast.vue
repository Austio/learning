<template>
  <div class="row navigation nav-container">
    <nav>
      <ul>
        <li>
          <nuxt-link class="navbar-link" to="/controlled_component">
            01 ControlledComponent
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/global_management">
            02 Modal Global Events
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/portal_modal">
            03 Portal Modal
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
