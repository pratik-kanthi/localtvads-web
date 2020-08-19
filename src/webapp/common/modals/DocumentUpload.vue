<template>
    <b-modal size="lg" v-model="show" centered hide-footer no-close-on-esc no-close-on-backdrop>
        <div slot="modal-header">
            <strong>Upload Documents</strong>
            <button class="close float-right" type="button" @click="close">
                <i class="material-icons">close</i>
            </button>
        </div>
        <div class="p24">
            <div>
                <div class="t-l black">Provide a name for your document</div>
                <div class="form-group">
                    <input type="text" v-model="docName" class="form-control mt8" />
                </div>
            </div>
            <div class="mt32">
                <h4 class="section-subtitle mt0 mb8"></h4>
                <input type="file" @change="fileUploaded" accept="*/*" ref="fileUpload" />
            </div>
        </div>
        <div class="footer">
            <button class="btn btn-secondary-small" @click="close">Cancel</button>
            <button :disabled="!sdocName" class="btn btn-primary-small ml16 float-right" @click="uploadDocument">Confirm</button>
        </div>
    </b-modal>
</template>

<script>
export default {
    name: 'DocumentUpload',
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            maxSize: 4,
            upload: {},
            docName: null,
            data: {
                name: ''
            },
            allowedExtenstions: ['pdf', 'docx', 'ppt', 'xlsx'],
            config: {
                method: 'POST',
                api: `/api/${this.$store.getters.getUser.Owner._id}/clientresource/document`
            }
        };
    },
    methods: {
        close() {
            this.$emit('close');
        },
        fileUploaded() {
            this.upload.chosen = this.$refs.fileUpload.files[0];
            if (this.maxSize && this.upload.chosen.size > 1024 * 1024 * this.maxSize) {
                this.$swal('Warning', 'File exceeds the minimum size of ' + this.maxSize + ' MB', 'warning');
                this.upload = {};
                return;
            }
        },
        callAPI(formData) {
            return new Promise(async (resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open(this.config.method, window.endpoint + this.config.api, true);
                xhr.setRequestHeader('Accept-Type', 'application/json');
                xhr.setRequestHeader('Authorization', 'bearer ' + this.$cookies.get('token'));
                xhr.onload = () => {
                    if (xhr.status !== 200) {
                        return reject({
                            code: xhr.status,
                            data: xhr.statusText
                        });
                    } else {
                        resolve(xhr.response);
                    }
                };
                xhr.onerror = () => {
                    this.loading = false;
                };
                xhr.send(formData);
            });
        },
        async uploadDocument() {
            try {
                let result;

                let formData = new window.FormData();
                if (this.$refs.fileUpload && this.$refs.fileUpload.files && this.$refs.fileUpload.files[0]) {
                    formData.append('file', this.$refs.fileUpload.files[0]);
                }

                let document = JSON.stringify({
                    Name: this.docName,
                    Owner: this.$store.getters.getUser.Owner._id,
                    OwnerType: 'Client'
                });

                formData.append('document', document);
                result = await this.callAPI(formData);

                this.$swal({
                    title: 'Uploaded',
                    text: 'Document has been uploaded',
                    type: 'success'
                }).then(() => {
                    this.$emit('close', result);
                });
            } catch (err) {
                this.$swal({
                    title: 'Error',
                    text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error'
                });
                console.error(err);
            }
        }
    }
};
</script>

<style lang="scss" scoped></style>
