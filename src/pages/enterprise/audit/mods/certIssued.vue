<template>
    <el-form label-width="130px" size="small" :model="form" ref="certs" label-suffix="：">
        <el-row  align="middle">
            <el-col v-for="(item, index) in form.certs" :key="index" :style="{clear: index % 2 == 0 ? 'both' : none}">
                <div class="yl-info-title" style="margin-bottom: 0">
                    <h3>{{item.certName}} <!--<span v-if="type == 'current' ">（变更后）</span>--></h3>
                </div>
                <el-form-item label="证号">
                    <p v-text="item.certCode" :class="compareVal(index, 'certCode')"></p>
                </el-form-item>
                <el-form-item label="许可日期" v-if="item.isNeedStartTime">
                    <el-form-item v-if="item.isNeedStartTime">
                        <div :class="compareVal(index, 'startTime,longTerm,endTime')">
                            <span v-text="item.startTime"></span>
                            <span v-if="item.isNeedStartTime && item.isNeedEndTime"> - </span>
                            <span>
                                    {{item.longTerm == 1 ? '长期': item.endTime }}
                                </span>
                        </div>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="证照图片">
                    <FilePreview :files="item.certImg"></FilePreview>
                </el-form-item>
                <template v-if="!isDetail">
                    <template v-if="type == 'current'">
                        <el-form-item label="审核结果">
                            <el-radio v-model="item.status" label="1">成功</el-radio>
                            <el-radio v-model="item.status" label="0">失败</el-radio>
                        </el-form-item>
                        <el-form-item label="原因" :prop="'certs.' + index + '.reason' "
                                      :rules="{ required: item.status == '0', message: '原因不能为空', trigger: 'blur'}"
                        >
                            <el-input v-model="item.reason"></el-input>
                        </el-form-item>
                    </template>
                    <template v-else>
                        <el-form-item label="审核结果">
                            <p :class="item.className">
                                {{item.auditName}}
                            </p>
                        </el-form-item>
                        <el-form-item label="原因">
                            <p v-text="item.reason"></p>
                        </el-form-item>
                    </template>
                </template>

            </el-col>
        </el-row>
        <el-alert type="info" title="经销商未上传证照" v-if="list.length == 0" :closable="false"></el-alert>
    </el-form>
</template>

<script>
// import BASE from '@/utils/constant/index.js';
export default {
    name: 'certIssued',
    data () {
        return {
            style: {},
            form: {
                certs: []
                // certs: JSON.parse(JSON.stringify(BASE.certs))
            }
        };
    },
    props: {
        list: {
            type: Array
        },
        type: {
            type: Boolean
        },
        compare: {
            type: Object
        },
        isDetail: {
            type: Boolean,
            default: true
        }
    },
    watch: {
        list (val) {
            this.mixinsCert(val);
        }
    },
    methods: {
        compareVal (item, vals) {
            let oldCerts = this.compare.old.certVos;
            let newCerts = this.compare.current.certVos;
            let isDiff = false;
            if (!oldCerts || !newCerts) {
                return '';
            }
            if (oldCerts.length && this.type === 'current') {
                let keys = vals.split(',');
                keys.forEach(data => {
                    if (oldCerts[item][data] !== newCerts[item][data]) {
                        isDiff = true;
                    }
                });
            }
            if (isDiff) {
                return 'text-danger';
            } else {
                return '';
            }
        },
        mixinsCert (val) {
            if (!val) {
                return;
            }
            val.length && this.form.certs.forEach(item => {
                let data = val.filter(data => data.certType === item.certType);
                if (data.length) {
                    data = data[0];
                    switch (data.auditStatus) {
                    case '1':
                        item.auditName = '审核成功';
                        item.className = 'text-success';
                        break;
                    case '0':
                        item.auditName = '审核失败';
                        item.className = 'text-danger';
                        break;
                    }
                    Object.assign(item, data);
                }
            });
        }
    },
    created () {
        this.mixinsCert(this.list);
    }
};
</script>

<style scoped>

</style>
