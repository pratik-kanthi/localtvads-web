<template>
    <div>
        <LoaderModal :showloader="isLoading"></LoaderModal>
        <div class="container" v-if="clientAdPlan">
            <h3 class="brand-secondary mt64">
                {{ clientAdPlan.Channel.Name }} - {{ clientAdPlan.ChannelProduct.ProductLength.Name }}
                <span
                    :class="getStatusClass(clientAdPlan.Status)"
                    class="t-l mb16"
                >{{ clientAdPlan.Status }}</span>
            </h3>
            <div class="mt32 horizontal-tabs">
                <b-tabs>
                    <b-tab title="Plan Information" active>
                        <div class="p32 shadow mt32">
                            <div class="row">
                                <div class="plan-info col-md-4">
                                    <div class="t-l black">Channel</div>
                                    <div class="t-l">{{ clientAdPlan.Channel.Name }}</div>
                                </div>
                                <div class="plan-info col-md-4">
                                    <div class="t-l black">Plan Duration</div>
                                    <div
                                        class="t-l"
                                    >{{ clientAdPlan.ChannelProduct.ProductLength.Duration }} months</div>
                                </div>
                                <div class="plan-info col-md-4">
                                    <div class="t-l black">Booked date</div>
                                    <div
                                        class="t-l"
                                    >{{ clientAdPlan.BookedDate | formatDate('DD MMM YYYY') }}</div>
                                </div>
                            </div>

                            <div class="mt48 row">
                                <div class="col-md-4">
                                    <div class="t-l black">Start Date</div>
                                    <div
                                        v-if="clientAdPlan.StartDate"
                                        class="t-l"
                                    >{{ clientAdPlan.StartDate | formatDate('DD MMM YYYY') }}</div>
                                    <div v-else class="brand-primary t-l">
                                        The start date for your ad broadcast
                                        <br />will be available once your ad is approved
                                    </div>
                                </div>
                                <div class="col-md-4 mt-sm-2">
                                    <div class="t-l black">Slots Selected</div>
                                    <div>
                                        <span
                                            class
                                            v-for="(slot, key) in clientAdPlan.ChannelProduct.ChannelSlots"
                                            :key="key"
                                        >
                                            <span
                                                class="t-l"
                                            >{{ slot.Slot.Name }} ( {{ slot.Slot.StartTime }} - {{ slot.Slot.EndTime }})</span>
                                        </span>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="t-l black">Weekly Schedule</div>
                                    <WeekDays
                                        :disabled="true"
                                        mode="table"
                                        :value="clientAdPlan.Days"
                                    ></WeekDays>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="row mt32 mb32">
                                <div class="col-md-6">
                                    <div>
                                        <div class="t-l black">Add Ons Purchased</div>
                                        <div v-if="clientAdPlan.Addons.length > 0">
                                            <div
                                                v-for="(addon, key) in clientAdPlan.Addons"
                                                :key="key"
                                                class="plan-addon shadow rounded p32 mt16"
                                            >
                                                <div class="t-l black bold">{{ addon.Name }}</div>
                                                <div class="t-m mt8 brand-primary">Features:</div>
                                                <div
                                                    class="t-s"
                                                    v-for="(benefit, bkey) in addon.Benefits"
                                                    :key="bkey"
                                                >{{ benefit }}</div>
                                                <div v-if="addon.IsUploadRequired">
                                                    <div
                                                        class="mt16 t-s italic brand-primary"
                                                    >This add on requires you to upload your videos and images</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else>
                                            <div
                                                class="t-l mt24"
                                            >You have not purchased any add ons for this plan.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </b-tab>

                    <b-tab title="Video & Assets">
                        <div
                            class="t-l brand-secondary mt24"
                        >This section allows you to manage the assets that go into your final video production</div>
                        <b-card no-body class="mt32 vertical-tabs">
                            <b-tabs pills card vertical>
                                <b-tab
                                    v-if="clientAdPlan.Addons.length == 0"
                                    title="Ad Video"
                                    active
                                >
                                    <div class="upload-wrapper p48">
                                        <div
                                            v-if="clientAdPlan && !clientAdPlan.AdVideo && !upload.chosen && progress === 0"
                                            class="upload-box"
                                        >
                                            <h4 class="bold">You can upload your Ad's Video here</h4>
                                            <p
                                                class="text-muted mb0"
                                            >Click on the upload button or drag and drop your upload file here.</p>
                                            <p
                                                class="brand-primary"
                                            >(please upload a video in any of these formats: {{ config.allowedExtensions.join(', ') }} )</p>

                                            <input
                                                id="fileUpload"
                                                class="hidden"
                                                type="file"
                                                @change="fileUploaded"
                                                accept="video/mp4, video/x-m4v, video/*"
                                                ref="fileUpload"
                                            />
                                            <button
                                                class="btn btn-primary upload mt16"
                                                @click="chooseFile"
                                                :disabled="isLoading"
                                            >
                                                <img src="@/assets/images/upload.svg" />
                                                <span class="button-text">Upload Video</span>
                                            </button>
                                        </div>

                                        <div
                                            v-if="clientAdPlan && clientAdPlan.AdVideo && !upload.chosen"
                                        >
                                            <div class="t-l black">Your ad video</div>
                                            <div class="video-wrapper mt24">
                                                <video controls class="mb24">
                                                    <source
                                                        :src="GOOGLE_BUCKET_ENDPOINT + clientAdPlan.AdVideo.AssetUrl"
                                                        type="video/mp4"
                                                    />
                                                </video>
                                            </div>
                                        </div>

                                        <div
                                            class="video-wrapper"
                                            v-if="progress === 0 && upload.chosen"
                                        >
                                            <video controls class="mb24">
                                                <source :src="videoUrl" type="video/mp4" />
                                            </video>
                                            <div class="action text-center">
                                                <button
                                                    class="btn btn-secondary btn-bordered m-xs0 mr16"
                                                    @click="cancelUpload"
                                                >Cancel</button>
                                                <button
                                                    class="btn btn-primary"
                                                    @click="uploadVideo"
                                                >Submit</button>
                                            </div>
                                        </div>

                                        <div class="upload-progress" v-else-if="progress > 0">
                                            <div class="details white-bg">
                                                <div class="pull-left">
                                                    <strong class="t-l" v-text="upload.chosen.name"></strong>&nbsp;
                                                    <span class="text-muted">is uploading...</span>
                                                </div>
                                                <div class="pull-right">
                                                    <strong v-text="progress + ' %'"></strong>
                                                </div>
                                                <br class="clearfix" />
                                                <div class="loader">
                                                    <div
                                                        class="value"
                                                        :style="{ width: progress + '%' }"
                                                    ></div>
                                                </div>
                                                <br class="clearfix" />
                                            </div>
                                        </div>
                                    </div>
                                </b-tab>

                                <b-tab
                                    v-if="clientAdPlan && clientAdPlan.Addons.length > 0"
                                    title="Videos"
                                >
                                    <div class="p24">
                                        <div class="t-l black">Add On Videos</div>

                                        <div class="row mt24">
                                            <div
                                                class="col-md-3 video-wrapper"
                                                v-for="(asset, key) in clientAdPlan.AddOnAssets"
                                                :key="key"
                                            >
                                                <video
                                                    :src="GOOGLE_BUCKET_ENDPOINT + asset.AssetUrl"
                                                    width="100%"
                                                    height="100%"
                                                ></video>
                                            </div>
                                        </div>

                                        <div
                                            class="video-wrapper"
                                            v-if="progress === 0 && upload.chosen"
                                        >
                                            <video controls class="mb24">
                                                <source :src="videoUrl" type="video/mp4" />
                                            </video>
                                            <div class="action text-center">
                                                <button
                                                    class="btn btn-secondary btn-bordered m-xs0 mr16"
                                                    @click="cancelUpload"
                                                >Cancel</button>
                                                <button
                                                    class="btn btn-primary"
                                                    @click="uploadAddOnVideo"
                                                >Submit</button>
                                            </div>
                                        </div>

                                        <div class="upload-wrapper">
                                            <input
                                                id="fileUpload"
                                                class="hidden"
                                                type="file"
                                                @change="fileUploaded"
                                                accept="video/mp4, video/x-m4v, video/*"
                                                ref="fileUpload"
                                            />
                                            <button
                                                class="btn btn-primary-small upload mt16"
                                                @click="chooseFile"
                                                :disabled="isLoading"
                                            >
                                                <span class="button-text">Add Video</span>
                                            </button>
                                        </div>
                                    </div>
                                </b-tab>

                                <b-tab
                                    v-if="clientAdPlan && clientAdPlan.Addons.length > 0"
                                    title="Images"
                                >
                                    <div class="p24">
                                        <div class="t-l black">You can upload your images here</div>
                                    </div>
                                </b-tab>

                                <b-tab
                                    v-if="clientAdPlan && clientAdPlan.Addons.length > 0"
                                    title="Text"
                                >
                                    <div class="p24">
                                        <div
                                            class="t-l black"
                                        >You can provide text related to your ad here</div>
                                    </div>
                                </b-tab>
                            </b-tabs>
                        </b-card>
                    </b-tab>

                    <b-tab title="Billing & Transactions">
                        <div class="mt32 payment-info">
                            <div class="t-l black">Payment Information</div>
                            <div class="mt24">
                                <div class="row">
                                    <div class="col-md-8 col-6">
                                        <div class="brand-primary t-l">Channel Ad Plan</div>
                                    </div>
                                    <div class="col-md-4 col-6">
                                        <div
                                            class="black text-right t-l"
                                        >{{ clientAdPlan.WeeklyAmount | currency }} / week</div>
                                    </div>

                                    <div class="col-md-8">
                                        <div class="t-m">
                                            Plan Length:
                                            <span
                                                class="bold"
                                            >{{ clientAdPlan.ChannelProduct.ProductLength.Name }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="d-flex justify-content-between t-l mt48"
                                    v-if="clientAdPlan.Addons && clientAdPlan.Addons.length > 0"
                                >
                                    <div>
                                        <div>
                                            <div
                                                class="brand-primary d-flex flex-column flex-lg-row align-items-lg-end"
                                            >
                                                <div>{{ clientAdPlan.Addons[0].Name }}</div>
                                                <div class="ml-md-2">
                                                    <span class="tag-sm">Add On</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="black">{{ clientAdPlan.AddonsAmount | currency }}</div>
                                </div>

                                <div class="dashed-line">
                                    <div class="line"></div>
                                </div>

                                <div class="total mb32">
                                    <div class="row mt32">
                                        <div class="col-6 col-sm-6">
                                            <h5 class="t-xl">Total Amount</h5>
                                        </div>
                                        <div class="col-6 col-sm-6 text-right">
                                            <h5
                                                class="amount t-xl black pull-right"
                                            >{{ (clientAdPlan.WeeklyAmount + clientAdPlan.AddonsAmount) | currency }}</h5>
                                        </div>
                                    </div>
                                </div>

                                <!-- <div class="mt32">
                                            <button @click="downloadReceipt" class="btn btn-primary-small">Download Receipt</button>
                                </div>-->
                            </div>
                        </div>

                        <hr />

                        <div class="table-wrapper mt24">
                            <div class="black t-l">Transactions</div>
                            <Table
                                :items="planTransactions"
                                :headings="fields"
                                :pagination="pagination"
                                :sort.sync="sort"
                                responsive
                                table-class="mt48 table-responsive-xs table-responsive-stable-responsive-md"
                            >
                                <template v-slot:Status="data">
                                    <div
                                        class="bold"
                                        :class="data.value.Status.toLowerCase()"
                                    >{{ data.value.Status }}</div>
                                </template>

                                <template v-slot:DateTime="data">
                                    <div>{{ data.value.DateTime | formatDate('DD MMM YYYY') }}</div>
                                </template>
                                <template v-slot:TotalAmount="data">
                                    <div>{{ data.value.TotalAmount | currency }}</div>
                                </template>
                                <template v-slot:Action="data">
                                    <div
                                        v-if="data.value.Status == 'SUCCEEDED'"
                                        class="brand-primary pointer"
                                        @click="downloadReceipt(data.value._id)"
                                    >Download Receipt</div>
                                </template>
                            </Table>
                        </div>
                    </b-tab>
                </b-tabs>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ClientAdService from '@/services/ClientAdService';
import WeekDays from '@/e9_components/components/WeekDays';
import '@/plugins/socket.io';
import { uploadMixin } from '@/mixins/upload';
import TransactionService from '@/services/TransactionService';
import Table from '@/e9_components/components/Table';

export default {
    name: 'AdPlanDetails',
    components: {
        WeekDays,
        Table,
    },
    mixins: [uploadMixin],
    data() {
        return {
            taxes: [],
            taxInfo: [],
            planTransactions: [],
            taxAmount: 0,
            isLoading: true,
            clientAdPlan: null,
            processing: false,
            fields: [
                {
                    key: 'DateTime',
                    label: 'Transaction Date',
                },
                {
                    key: 'Status',
                },
                {
                    key: 'TotalAmount',
                    label: 'Total Amount',
                },
                {
                    key: 'ReferenceId',
                    label: 'Reference ID',
                },
                {
                    key: 'Action',
                    label: ' ',
                },
            ],
            perPage: 15,
            currentPage: 1,
            pagination: {
                currentPage: 1,
                perPage: 10,
            },
            sort: {
                name: 'Name',
                value: 'asc',
            },
        };
    },
    methods: {
        getStatusClass(status) {
            return status.toLowerCase();
        },
        showTaxInfo(isDisplay) {
            this.taxInfo = isDisplay;
        },
        async uploadFile() {
            this.$store.commit('VIDEO_BEING_UPLOADED', true);
            let counter = 1;
            let chunkSize = 100000;
            this.socket = this.io(window.socketendpoint, {
                query: {
                    token: this.$cookies.get('token'),
                },
            });
            let start = 0;
            let chunk = this.upload.chosen.slice(start, chunkSize);
            this.sendSocket(chunk, counter, chunkSize, this.clientAdPlan, 'UPLOAD_CHUNK');
            this.socket.on('UPLOAD_CHUNK_FINISHED', (data) => {
                this.progress = (((data * 100000) / this.upload.chosen.size) * 100).toFixed(0);
                ++counter;
                start = start + chunkSize;
                if (start - chunkSize < this.upload.chosen.size) {
                    chunk = this.upload.chosen.slice(start, start + chunkSize);
                    this.sendSocket(chunk, counter, chunkSize, this.clientAdPlan, 'UPLOAD_CHUNK');
                }
            });

            this.socket.on('UPLOAD_FINISHED', () => {
                this.progress = 100;
                this.processing = true;
            });
            this.socket.on('UPLOAD_ERROR', () => {
                this.$swal({
                    title: 'Error',
                    text: 'There was an error while uploading the video',
                    type: 'error',
                });
                this.socket.disconnect();
                this.isLoading = false;
                this.$store.commit('VIDEO_BEING_UPLOADED', false);
            });
            this.socket.on('PROCESS_FINISHED', () => {
                setTimeout(() => {
                    this.$swal({
                        title: 'Uploaded',
                        text: 'Ad has been uploaded successfully',
                        type: 'success',
                        confirmButtonColor: '#ff6500',
                    });
                    this.progress = 0;
                    this.processing = false;
                    this.$store.commit('VIDEO_BEING_UPLOADED', false);
                    this.socket.disconnect();
                }, 1000);
            });
        },
        async uploadAddOnFile() {
            this.isLoading = true;
            this.$store.commit('VIDEO_BEING_UPLOADED', true);
            let counter = 1;
            let chunkSize = 100000;
            this.socket = this.io(window.socketendpoint, {
                query: {
                    token: this.$cookies.get('token'),
                },
            });
            let start = 0;
            let chunk = this.upload.chosen.slice(start, chunkSize);
            this.sendSocket(chunk, counter, chunkSize, this.clientAdPlan, 'UPLOAD_RESOURCE_CHUNK');
            this.socket.on('UPLOAD_CHUNK_FINISHED', (data) => {
                this.progress = (((data * 100000) / this.upload.chosen.size) * 100).toFixed(0);
                ++counter;
                start = start + chunkSize;
                if (start - chunkSize < this.upload.chosen.size) {
                    chunk = this.upload.chosen.slice(start, start + chunkSize);
                    this.sendSocket(chunk, counter, chunkSize, this.clientAdPlan, 'UPLOAD_RESOURCE_CHUNK');
                }
            });

            this.socket.on('ADDON_UPLOAD_FINISHED', (data) => {
                this.progress = 100;
                setTimeout(() => {
                    this.$swal({
                        title: 'Uploaded',
                        text: 'Ad has been uploaded successfully',
                        type: 'success',
                        confirmButtonColor: '#ff6500',
                    });
                    this.progress = 0;
                    this.isLoading = false;
                    this.upload.chosen = null;
                    this.clientAdPlan.AddOnAssets.push(data);
                    this.socket.disconnect();
                    this.getAllMedia();
                }, 1000);
            });
            this.socket.on('UPLOAD_ERROR', () => {
                this.$swal({
                    title: 'Error',
                    text: 'There was an error while uploading the video',
                    type: 'error',
                });
                this.socket.disconnect();
                this.isLoading = false;
            });
        },
        async getPlanTransactions() {
            try {
                this.planTransactions = await TransactionService.getTransactions(this.getUser().Owner._id, this.$route.query.id);
            } catch (err) {
                this.$swal({
                    title: 'Error',
                    text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error',
                });
                console.error(err);
                this.isLoading = false;
            }
        },
        ...mapGetters(['getUser']),
    },
    async created() {
        try {
            this.clientAdPlan = await ClientAdService.getPlanDetails(this.$route.query.id);
            this.getPlanTransactions();

            this.isLoading = false;
        } catch (err) {
            this.$swal({
                title: 'Error',
                text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                type: 'error',
            });
            console.error(err);
            this.isLoading = false;
        }
    },
};
</script>

<style scoped lang="scss">
.video-wrapper {
    height: auto;
    video {
        height: 120px;
        object-fit: cover;
        background: $black;
    }
}

.upload-wrapper {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    .upload-box {
        background: $white;
        border-radius: 10px;
        text-align: center;
        .upload {
            padding-left: 8px !important;
            height: 48px;
            box-shadow: 1px 1px 8px 0 rgba(0, 0, 0, 0.3);
            &:focus {
                border: none;
                outline: 0;
            }
            img {
                top: 3px;
                position: relative;
                padding-right: 8px;
            }
            .button-text {
                border-left: 1px solid $light-grey;
                padding-top: 2px;
                padding-bottom: 2px;
                padding-left: 20px;
                padding-right: 8px;
                font-size: 14px;
                font-weight: 500;
            }
        }
    }
    .video-wrapper {
        height: auto;
        video {
            height: 400px;
            object-fit: contain;
            background: #000;
        }
    }
}
</style>
