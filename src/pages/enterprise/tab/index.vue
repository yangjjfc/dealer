<template>
    <div class="container_setion">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="经销商" name="first">
                <All v-if="activeName == 'first'"></All>
            </el-tab-pane>
            <el-tab-pane label="待准入审核" name="second">
                <Audit v-if="activeName == 'second'" auditType="0"></Audit>
            </el-tab-pane>
            <el-tab-pane label="变更审核" name="third">
                <Audit v-if="activeName == 'third'" auditType="1"></Audit>
            </el-tab-pane>

        </el-tabs>
    </div>
</template>
<script>
import All from '../all/index';
import Audit from '../audit/index';
import commonMix from '@/utils/mixins/commonMix';

export default {
    mixins: [commonMix],
    data () {
        return {
            activeName: this.$route.query.source || this._showAuthTab([{
                code: 'TAB_DEALERINFORMATIONMAINTENANCE_DEALERINFO',
                name: 'first'
            }, {
                code: 'TAB_DEALERINFORMATIONMAINTENANCE_AUDITINGDEALER',
                name: 'second'
            }, {
                code: 'TAB_DEALERINFORMATIONMAINTENANCE_CHANGEINFO',
                name: 'third'
            }])
        };
    },
    components: {
        All,
        Audit
    },
    methods: {
        handleClick (tab, event) {
            this.$router.replace({ query: { source: tab.name } });
        }
    }
};
</script>
