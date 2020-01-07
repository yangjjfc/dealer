<template>
  <section>
    <yl-dialog title="查看" :show.sync="shows" width="600px" @submit="handleSubmit" :hide-submit-button="true">
      <div>
        <el-form ref="dialogForm" :model="form" label-width="100px" label-suffix="：" size="small" status-icon>
          <el-form-item label="证号" prop="roleName">
            <p>{{data.certCode}}</p>
          </el-form-item>
          <el-form-item label="许可时间" prop="roleName">
            <p>{{data.startTime}} - {{data.endTime}}</p>
          </el-form-item>
          <el-form-item label="证照图片" prop="roleName">
                <yl-file-upload :value="data.certImg"  disabled hideUploadBtn></yl-file-upload>
          </el-form-item>
        </el-form>
      </div>
    </yl-dialog>
  </section>
</template>

<script>

export default {
    data () {
        return {
        };
    },
    methods: {

    },
    props: {
        show: {
            type: Boolean,
            required: true,
            default: false
        },
        data: {
            type: Object
        }
    },
    computed: {
        shows: {
            get () {
                return this.show;
            },
            set (newValue) {
                this.$emit('update:show', newValue);
            }
        }
    },
    created () {

    }

};
</script>

<style lang="scss" scoped>
</style>
