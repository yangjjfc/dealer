<!-- 客户管理 -->
<template>
  <section class="container_setion">
    <el-tabs v-model="elTab.activeName" @tab-click="tabChange">
      <el-tab-pane v-for="item in elTab.list" :key="item.name" v-bind="item">
        <span slot="label">{{item.label}}</span>
        <component :is="elTab.activeName" v-if="(elTab.activeName === item.name)"></component>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<script>
// import auditCustomer from './auditCustomer/index';
// import hasCustomer from './hasCustomer/index';

export default {
    data () {
        return {
            elTab: { // eltab 数据
                list: [{
                    label: '已有客户',
                    name: 'hasCustomer'
                }, {
                    label: '待审核客户',
                    name: 'auditCustomer'
                }],
                activeName: this.$route.query.source || 'auditCustomer'
            }
        };
    },
    methods: {
        tabChange (tab, event) {
            this.$router.push({ query: { source: tab.name } });
        }
    },
    components: {
        // auditCustomer,
        // hasCustomer

    }
};

</script>
<style lang="scss" scoped>
.text-badge {
  background-color: red;
  border-radius: 5px;
  padding: 0 3px;
  color: #fff;
}
</style>
