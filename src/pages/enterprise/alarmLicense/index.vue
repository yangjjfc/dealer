<template>
  <section class="container_setion">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" size="small" @submit.native.prevent>
          <el-form-item>
            <el-select v-model="search.certType" placeholder="请选择" class="w160" @change="getList(1)" size="small">
              <el-option v-for="item in certTypeOpt" :key="item.key" :label="item.val" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="search.overdueStatus" placeholder="请选择" class="w160" @change="getList(1)" size="small">
              <el-option v-for="item in overdueStatusOpt" :key="item.key" :label="item.val" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="searchBox">
            <el-input v-model.trim="search.keywords" placeholder="经销商编号/经销商名称/证件号" class="w200" size="small" @keyup.enter.native="getList(1)" clearable></el-input>
            <el-button type="primary" icon="el-icon-search" size="small" class="mgr10" @click="getList(1)">查询</el-button>
            <el-button size="small" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24">
        <el-table :data="list" stripe style="width: 100%" border size="small" class="my-table mgb10">
          <el-table-column prop="indexX" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="enterpriseNo" label="经销商编号" width="120"></el-table-column>
          <el-table-column prop="enterpriseName" label="经销商名称" min-width="140"></el-table-column>
          <el-table-column prop="certTypeX" label="证照类型" width="160">
          </el-table-column>
          <el-table-column prop="certCode" label="证照号" min-width="120"></el-table-column>
          <el-table-column prop="roleName" label="证照有效期" min-width="160">
            <template slot-scope="scope">
              <div>
                {{scope.row.startTime}} - {{scope.row.endTime}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="expiryDays" label="过期天数" width="140" align="center"></el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleWarn(scope.row)" v-auth:BUTTON_DOCUMENTWARNING_REMIND>提醒</el-button>
              <el-button size="mini" type="text" @click="handleView(scope.row)" v-auth:BUTTON_DOCUMENTWARNING_DETAIL>查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <yl-pagination class="right " :total="page.total" :pageSize.sync="page.pageSize" :currentPage.sync="page.pageIndex" @change="getList"></yl-pagination>
      </el-col>
    </el-row>
    <Detail v-if="detail.show" :show.sync="detail.show" v-bind="detail"></Detail>
  </section>
</template>

<script type="text/ecmascript-6">
import commonMix from '@/utils/mixins/commonMix';
import Detail from './mods/detail';
const URL = {
    findListPage: 'yhlo.brp.enterprisePlatform.findCertWarnPage',
    remind: 'yhlo.brp.enterprisePlatform.remind'
};
// 证照
const CERTTYPE_OPT = [{
    key: '-1',
    val: '证照类型'
}, {
    key: 'yyzz',
    val: '营业执照'
}, {
    key: 'ylqxjyxkz',
    val: '医疗器械经营企业许可证'
}];
const OVERDUESTATUS_OPT = [{
    key: '-1',
    val: '过期时间'
}, {
    key: '0',
    val: '已过期'
}, {
    key: '1',
    val: '一个月内过期'
}, {
    key: '3',
    val: '三个月内过期'
}];
const SEARCH = {
    certType: '-1',
    keywords: '',
    overdueStatus: '-1'
};
export default {
    mixins: [commonMix],
    data () {
        return {
            search: { ...SEARCH },
            certTypeOpt: CERTTYPE_OPT,
            overdueStatusOpt: OVERDUESTATUS_OPT,
            list: [],
            detail: { // 查看
                show: false,
                data: {}
            }
        };
    },
    created () {
        this.getList(1);
    },
    methods: {
        getList (pageIndex = this.page.pageIndex, pageSize = this.page.pageSize) {
            let params = { ...this.search };
            this.Http(URL.findListPage, {
                params,
                pageParams: {
                    pageIndex: pageIndex,
                    pageSize: pageSize
                }
            }).then((res) => {
                this.page.total = res.data.total;
                this.page.pageIndex = res.data.pageIndex;
                this.page.pageSize = res.data.pageSize;
                if (res.data.rows) {
                    this.list = res.data.rows.map((item, index) => {
                        item.indexX = (this.page.pageIndex - 1) * this.page.pageSize + index + 1;
                        let certType = this.certTypeOpt.filter(_ => _.key === item.certType);
                        item.certTypeX = certType.length && certType[0].val;
                        if (item.longTerm === '1') {
                            item.endTime = '长期';
                        }
                        return item;
                    });
                }
            });
        },
        reset () {
            this.search = { ...SEARCH };
            this.getList(1);
        },
        handleView (row) {
            this.detail.data = row;
            this.detail.show = true;
        },
        // 提醒
        handleWarn (row) {
            this.Http(URL.remind, {
                params: {
                    enterpriseNo: row.enterpriseNo,
                    certType: row.certType
                }
            }).then(res => {
                this.$message.success('提醒成功');
            });
        }
    },
    components: {
        Detail
    }
};
</script>

<style scoped lang="scss">
</style>
