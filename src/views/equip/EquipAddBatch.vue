<template>
      <div class="panel">
        <Register :uesrType="uesrType"></Register>
      </div>
</template>
<script>

import Register from "@/components/AddRobotInBatch";

export default {
  
  data() {
    return {
     
      uesrType: '2',
    }
  },
  components: {
    Register,
  },
}
</script>

