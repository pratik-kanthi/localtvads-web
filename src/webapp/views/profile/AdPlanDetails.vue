<template>
    <div>
        <LoaderModal :showloader="isLoading"></LoaderModal>
        <ImageUpload v-if="showUploadImageModal" @cancel="cancelImageUploadModal" @close="closeImageUploadModal" :show="true" :config="config" :data="{ ownerid: getUser().Owner._id }"></ImageUpload>

        <div v-if="attachvideo">
            <AttachVideo @close="closeVideoSelector" @videoselected="handleAttachVideo"></AttachVideo>
        </div>

        <div v-if="attachimages">
            <AttachImages :plan-images="clientResources" @close="closeAttachImages" @imagesselected="handleAttachImages"></AttachImages>
        </div>

        <VideoModal :show-video="showvideo" :video-url="videourl" @close="closeVideoPlayer"></VideoModal>

        <div class="container" v-if="clientAdPlan">
            <h3 class="brand-secondary mt64">
                {{ clientAdPlan.Channel.Name }} - {{ clientAdPlan.ChannelProduct.ProductLength.Name }}
                <span :class="getStatusClass(clientAdPlan.Status)" class="t-l mb16">{{ clientAdPlan.Status }}</span>
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
                                    <div class="t-l">{{ clientAdPlan.ChannelProduct.ProductLength.Duration }} months</div>
                                </div>
                                <div class="plan-info col-md-4">
                                    <div class="t-l black">Booked date</div>
                                    <div class="t-l">{{ clientAdPlan.BookedDate | formatDate('DD MMM YYYY') }}</div>
                                </div>
                            </div>

                            <div class="mt48 row">
                                <div class="col-md-4">
                                    <div class="t-l black">Start Date</div>
                                    <div v-if="clientAdPlan.StartDate" class="t-l">{{ clientAdPlan.StartDate | formatDate('DD MMM YYYY') }}</div>
                                    <div v-else class="brand-primary t-l">
                                        The start date for your ad broadcast
                                        <br />will be available once your ad is approved
                                    </div>
                                </div>
                                <div class="col-md-4 mt-sm-2">
                                    <div class="t-l black">Slots Selected</div>
                                    <div>
                                        <span class v-for="(slot, key) in clientAdPlan.ChannelProduct.ChannelSlots" :key="key">
                                            <span class="t-l">{{ slot.Slot.Name }} ( {{ slot.Slot.StartTime }} - {{ slot.Slot.EndTime }})</span>
                                        </span>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="t-l black">Weekly Schedule</div>
                                    <WeekDays :disabled="true" mode="table" :value="clientAdPlan.Days"></WeekDays>
                                </div>
                            </div>
                        </div>
                        <div class="p32 shadow mt32">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="t-l black">Your video</div>
                                    <div v-if="clientAdPlan.AdVideo" class="ad-video mt16">
                                        <video @click="openVideo(clientAdPlan.AdVideo.ResourceUrl)" class="video pointer" :id="clientAdPlan.AdVideo._id" :src="GOOGLE_BUCKET_ENDPOINT + clientAdPlan.AdVideo.ResourceUrl" width="100%" height="100%" @loadedmetadata="forwardVideo(clientAdPlan.AdVideo._id)"></video>
                                    </div>
                                    <div v-else>
                                        <div class="t-s mt16">Please upload your ad video by clicking the below button.</div>
                                        <button @click="showVideoSelector" class="btn btn-primary-small mt16">Add Video</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mt32 mb32">
                            <div class="col">
                                <div>
                                    <div class="t-l black">Purchased Add On :</div>
                                    <div v-if="clientAdPlan.Addons.length > 0">
                                        <div v-for="(addon, key) in clientAdPlan.Addons" :key="key" class="plan-addon shadow rounded p32 mt24">
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="t-l black bold">{{ addon.Name }}</div>
                                                    <div class="t-m mt8 brand-primary">Features:</div>
                                                    <div class="t-s" v-for="(benefit, bkey) in addon.Benefits" :key="bkey">{{ benefit }}</div>
                                                    <div v-if="clientAdPlan.Addons[0].IsUploadRequired" class="mt16 t-l brand-primary">This add on requires you to upload your videos and images</div>
                                                    <div v-else class="mt16 t-l brand-primary">This add on does not require any uploads</div>
                                                </div>
                                            </div>
                                            <div v-if="clientAdPlan.Addons[0].IsUploadRequired" class="row mt24">
                                                <div class="col">
                                                    <div class="d-flex justify-content-between mt24">
                                                        <div class="t-l black">Images</div>
                                                        <button @click="showImageSelector" class="btn btn-primary-small">Add Images</button>
                                                    </div>
                                                    <div class="row mt16">
                                                        <div
                                                            v-for="(image, key) in clientResources.filter(resource => {
                                                                return resource.ResourceType == 'IMAGE';
                                                            })"
                                                            :key="key"
                                                            class="col-sm-2"
                                                        >
                                                            <div class="image" :style="{ 'background-image': 'url(' + GOOGLE_BUCKET_ENDPOINT + image.ResourceUrl + ')' }"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div v-if="clientAdPlan.Addons[0].IsUploadRequired" class="row mt24">
                                                <div class="col">
                                                    <div class="d-flex justify-content-between mt24">
                                                        <div class="t-l black">Videos</div>
                                                        <button @click="showVideoSelector" class="btn btn-primary-small">Add Videos</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <div class="t-l mt24">You have not purchased any add ons for this plan.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                        <div class="black text-right t-l">{{ clientAdPlan.WeeklyAmount | currency }} / week</div>
                                    </div>

                                    <div class="col-md-8">
                                        <div class="t-m">
                                            Plan Length:
                                            <span class="bold">{{ clientAdPlan.ChannelProduct.ProductLength.Name }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between t-l mt48" v-if="clientAdPlan.Addons && clientAdPlan.Addons.length > 0">
                                    <div>
                                        <div>
                                            <div class="brand-primary d-flex flex-column flex-lg-row align-items-lg-end">
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
                                            <h5 class="amount t-xl black pull-right">{{ (clientAdPlan.WeeklyAmount + clientAdPlan.AddonsAmount) | currency }}</h5>
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
                            <Table :items="planTransactions" :headings="fields" :pagination="pagination" :sort.sync="sort" responsive table-class="mt48 table-responsive-xs table-responsive-stable-responsive-md">
                                <template v-slot:Status="data">
                                    <div class="bold" :class="data.value.Status.toLowerCase()">{{ data.value.Status }}</div>
                                </template>

                                <template v-slot:DateTime="data">
                                    <div>{{ data.value.DateTime | formatDate('DD MMM YYYY') }}</div>
                                </template>
                                <template v-slot:TotalAmount="data">
                                    <div>{{ data.value.TotalAmount | currency }}</div>
                                </template>
                                <template v-slot:Action="data">
                                    <div v-if="data.value.Status == 'SUCCEEDED'" class="brand-primary pointer" @click="downloadReceipt(data.value._id)">Download Receipt</div>
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
import ImageUpload from '@/e9_components/components/ImageUpload';
import AttachVideo from '@/webapp/common/modals/AttachVideo';
import AttachImages from '@/webapp/common/modals/AttachImages';
import VideoModal from '@/webapp/common/modals/VideoModal';

export default {
    name: 'AdPlanDetails',
    components: {
        WeekDays,
        Table,
        ImageUpload,
        AttachVideo,
        AttachImages,
        VideoModal
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
            attachvideo: false,
            fields: [
                {
                    key: 'DateTime',
                    label: 'Transaction Date'
                },
                {
                    key: 'Status'
                },
                {
                    key: 'TotalAmount',
                    label: 'Total Amount'
                },
                {
                    key: 'ReferenceId',
                    label: 'Reference ID'
                },
                {
                    key: 'Action',
                    label: ' '
                }
            ],
            perPage: 15,
            currentPage: 1,
            pagination: {
                currentPage: 1,
                perPage: 10
            },
            sort: {
                name: 'Name',
                value: 'asc'
            },
            showUploadImageModal: false,
            config: {
                api: null,
                maxSize: 5,
                aspectRatio: 1
            },
            clientResources: [],
            imagesSelected: [],
            showvideo: false,
            attachimages: false,
            videourl: ''
        };
    },
    methods: {
        closeVideoPlayer() {
            this.showvideo = false;
            this.videourl = '';
        },
        getStatusClass(status) {
            return status.toLowerCase();
        },
        showTaxInfo(isDisplay) {
            this.taxInfo = isDisplay;
        },

        showVideoSelector() {
            this.attachvideo = true;
        },
        closeVideoSelector() {
            this.attachvideo = false;
        },

        showImageSelector() {
            this.attachimages = true;
        },
        addImage() {
            this.showUploadImageModal = true;
        },

        closeAttachImages() {
            this.attachimages = false;
        },
        cancelImageUploadModal() {
            this.showUploadImageModal = false;
        },
        closeImageUploadModal(data) {
            this.showUploadImageModal = false;
            this.clientResources.push(data);
        },
        async uploadAddOnFile() {
            this.isLoading = true;
            this.$store.commit('VIDEO_BEING_UPLOADED', true);
            let counter = 1;
            let chunkSize = 100000;
            this.socket = this.io(window.socketendpoint, {
                query: {
                    token: this.$cookies.get('token')
                }
            });
            let start = 0;
            let chunk = this.upload.chosen.slice(start, chunkSize);
            this.sendSocket(chunk, counter, chunkSize, this.clientAdPlan, 'UPLOAD_RESOURCE_CHUNK');
            this.socket.on('UPLOAD_CHUNK_FINISHED', data => {
                this.progress = (((data * 100000) / this.upload.chosen.size) * 100).toFixed(0);
                ++counter;
                start = start + chunkSize;
                if (start - chunkSize < this.upload.chosen.size) {
                    chunk = this.upload.chosen.slice(start, start + chunkSize);
                    this.sendSocket(chunk, counter, chunkSize, this.clientAdPlan, 'UPLOAD_RESOURCE_CHUNK');
                }
            });

            this.socket.on('ADDON_UPLOAD_FINISHED', data => {
                this.progress = 100;
                setTimeout(() => {
                    this.$swal({
                        title: 'Uploaded',
                        text: 'Ad has been uploaded successfully',
                        type: 'success',
                        confirmButtonColor: '#ff6500'
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
                    type: 'error'
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
                    type: 'error'
                });
                console.error(err);
                this.isLoading = false;
            }
        },
        async handleAttachVideo(video) {
            if (video) {
                try {
                    this.isLoading = true;
                    const result = await ClientAdService.attachVideo(this.$route.query.id, video._id);
                    const added_video = this.clientResources.find(item => {
                        return item._id == result.AdVideo;
                    });
                    this.clientAdPlan.AdVideo = added_video;
                    this.$swal({
                        title: 'Added',
                        text: 'Video added to your add successfully',
                        type: 'success',
                        confirmButtonColor: '#ff6500'
                    });
                    this.attachvideo = false;
                    this.isLoading = false;
                } catch (err) {
                    this.$swal({
                        title: 'Error',
                        text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                        type: 'error'
                    });
                    console.error(err);
                    this.isLoading = false;
                }
            }
        },
        async handleAttachImages(images) {
            if (images.length > 0) {
                try {
                    this.isLoading = true;
                    ClientAdService.attachImages(this.$route.query.id, images);
                    this.$swal({
                        title: 'Added',
                        text: 'Images added to your add successfully',
                        type: 'success',
                        confirmButtonColor: '#ff6500'
                    });
                    this.attachimages = false;
                    this.isLoading = false;
                } catch (err) {
                    this.$swal({
                        title: 'Error',
                        text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                        type: 'error'
                    });
                    console.error(err);
                    this.isLoading = false;
                }
            }
        },
        openVideo(url) {
            this.showvideo = true;
            this.videourl = this.GOOGLE_BUCKET_ENDPOINT + url;
        },
        forwardVideo(id) {
            let elem = document.getElementById(id);
            elem.currentTime = 2;
        },
        ...mapGetters(['getUser'])
    },
    async created() {
        try {
            this.clientAdPlan = await ClientAdService.getPlanDetails(this.$route.query.id);
            this.clientResources = this.clientAdPlan.AddOnAssets;
            this.getPlanTransactions();
            this.config.api = '/api/' + this.getUser().Owner._id + '/clientresource/image';
            this.isLoading = false;
        } catch (err) {
            this.$swal({
                title: 'Error',
                text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                type: 'error'
            });
            console.error(err);
            this.isLoading = false;
        }
    }
};
</script>

<style scoped lang="scss">
.ad-video {
    video {
        height: 134px;
        width: auto;
        border-radius: 5px;
    }
}
</style>
