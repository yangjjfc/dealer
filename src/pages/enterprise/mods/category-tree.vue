<template>
    <section>
        <yl-dialog title="经营范围" :show.sync="shows" width="800px" @submit="updateTree" append-to-body>
            <div slot="content">
                <el-tree ref="manageScopeTree" style="height: 380px; margin-bottom: 12px; overflow: auto;" :data="categoryTreeData" show-checkbox node-key="id" :default-expanded-keys="[]" :default-checked-keys="[]" :props="defaultProps">
                </el-tree>
            </div>
        </yl-dialog>
    </section>
</template>
<script>
import { Tools, emitter } from 'ycloud-ui';
console.log(Tools);

const URL = {
    CATEGRORYTREE: 'sdc.jyfwCategory.jyfwCategoryTreeView'
};

export default {
    name: 'categoryTree',
    mixins: [emitter],
    data () {
        return {
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            categoryTreeData: []
        };
    },
    mounted () {
        // 获取分类树
        this.Http(URL.CATEGRORYTREE, {
            params: {
                productType: 'ylqx'
            }
        }).then(results => {
            this.categoryTreeData = results.data;
            this.$nextTick(() => {
                let categoryIds = [];
                this.selectedData.forEach(value => {
                    categoryIds.push(value.categoryId);
                });
                if (categoryIds && categoryIds.length > 0) {
                    this.$refs.manageScopeTree.setCheckedKeys(categoryIds);
                }
            });
        });
    },
    props: {
        show: {
            type: Boolean,
            required: true,
            default: false
        },
        selectedData: {
            type: Array,
            default () {
                return [];
            }
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
    methods: {
        async updateTree () {
            this.$emit('getSelectedData', this.$refs.manageScopeTree.getCheckedNodes());
        }
    }
};

</script>
