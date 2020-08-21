<template>
    <div>
        <LoaderModal :showloader="isLoading"></LoaderModal>
        <ImageUpload v-if="showUploadImageModal" @cancel="cancelImageUploadModal" @close="closeImageUploadModal" :show="true" :config="config" :data="{ ownerid: getUser().Owner._id }"></ImageUpload>

        <div v-if="attachvideo">
            <AttachVideo @close="closeVideoSelector" @videoselected="handleAttachVideo"></AttachVideo>
        </div>

        <div v-if="attachimages">
            <AttachImages :show="attachimages" :plan-assets="planAssets" @closed="closeAttachImages" @done="handleAttachAssets"></AttachImages>
        </div>
        <div v-if="showvideo">
            <VideoModal :show-video="showvideo" :video-url="videourl" @close="closeVideoPlayer"></VideoModal>
        </div>

        <div v-if="lightBoxItems.length > 0">
            <CoolLightBox :items="lightBoxItems" :index="lightboxIndex" loop @close="lightboxIndex = null"></CoolLightBox>
        </div>

        <div v-if="showVideoUploadModal">
            <VideoUpload :show="showVideoUploadModal" @done="closeImageUploadModal" @close="cancelVideUploadModal"></VideoUpload>
        </div>

        <div v-if="showDocumentUploadModal">
            <DocumentUpload :show="showDocumentUploadModal" @close="handleDocumentUploadModal"></DocumentUpload>
        </div>

        <div v-if="showUpdateCard">
            <UpdateCard :show="showUpdateCard" @close="handleUpdateCard" :client-ad-plan-id="clientAdPlan._id" :current-card="clientAdPlan.PaymentMethod._id"></UpdateCard>
        </div>

        <div class="container" v-if="clientAdPlan">
            <div class="d-flex justify-content-between mt64">
                <div v-if="displayMode == 'VIEW'">
                    <h3 class="brand-secondary">{{ clientAdPlan.Name }}</h3>
                </div>
                <div class="row" v-else>
                    <div class="form-group">
                        <input class="w-100 form-control input-lg heading-input" id="inputlg" type="text" v-model="clientAdPlan.Name" />
                    </div>
                </div>
                <!--div class="t-l ml16" :class="getStatusClass(clientAdPlan.Status)">{{ clientAdPlan.Status }}</div-->
                <div>
                    <button v-if="displayMode == 'VIEW'" @click="displayMode = 'EDIT'" class="btn btn-link">Edit</button>
                </div>
                <div v-if="displayMode == 'EDIT'">
                    <button @click="upateClientAdPlan" class="btn btn-primary-small">Save</button>
                    <button @click="displayMode = 'VIEW'" class="ml16 btn btn-secondary-small">Cancel</button>
                </div>
            </div>

            <div class="mt32 horizontal-tabs">
                <b-tabs>
                    <b-tab title="Plan Information" active>
                        <div class="p32 shadow-border mt32">
                            <div class="row mt">
                                <div class="plan-info col-md-4">
                                    <div class="t-l black">Channel</div>
                                    <div class="t-l">{{ clientAdPlan.Channel.Name }}</div>
                                </div>
                                <div class="plan-info col-md-4 mt-3 mt-md-3">
                                    <div class="t-l black">Plan Duration</div>
                                    <div class="t-l">{{ clientAdPlan.ChannelProduct.ProductLength.Duration }} months</div>
                                </div>
                                <div class="plan-info col-md-4 mt-3 mt-md-3">
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
                                <div class="col-md-4 mt-sm-2 mt-3 mt-md-3">
                                    <div class="t-l black">Slots Selected</div>
                                    <div>
                                        <span class v-for="(slot, key) in clientAdPlan.ChannelProduct.ChannelSlots" :key="key">
                                            <span class="t-l">{{ slot.Slot.Name }} ( {{ slot.Slot.StartTime }} - {{ slot.Slot.EndTime }})</span>
                                        </span>
                                    </div>
                                </div>
                                <div class="col-md-4 mt-3 mt-md-3">
                                    <div class="t-l black">Weekly Schedule</div>
                                    <WeekDays :disabled="true" mode="table" :value="clientAdPlan.Days"></WeekDays>
                                </div>
                            </div>
                        </div>
                        <div class="row mt32 mb32">
                            <div class="col">
                                <div>
                                    <div class="t-l black">Add On:</div>
                                    <div v-if="clientAdPlan.Addons.length > 0">
                                        <div v-for="(addon, key) in clientAdPlan.Addons" :key="key" class="plan-addon shadow-border rounded p32 mt24">
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="t-l black bold">{{ addon.Name }}</div>
                                                    <div class="t-m mt8 brand-primary">Features:</div>
                                                    <div class="t-s" v-for="(benefit, bkey) in addon.Benefits" :key="bkey">{{ benefit }}</div>
                                                    <div class="mt16 t-l brand-primary">This add on requires you to upload your videos and images</div>
                                                </div>
                                            </div>
                                            <div class="row mt24">
                                                <div class="col">
                                                    <button @click="showImageSelector" class="btn btn-primary-small">Attach Assets</button>
                                                    <div class="d-flex justify-content-between mt24">
                                                        <div class="t-l black">Images</div>
                                                    </div>
                                                    <p class="light-grey mb0" v-if="!images || images.length == 0">No images attached</p>
                                                    <div class="row mt16">
                                                        <div class="col-sm-3">
                                                            <div @click="addImage" class="pointer border image d-flex flex-column justify-content-center align-items-center">
                                                                <img class="p8" src="@/assets/images/add_asset.png" height="64px" alt />
                                                                <div class="brand-primary">Upload Image</div>
                                                            </div>
                                                        </div>
                                                        <div v-for="(image, key) in images" :key="key" class="col-sm-3 image-box">
                                                            <i class="image-delete-icon material-icons" @click="removeAddonResource(image._id)">delete</i>
                                                            <div class="image ml8 pointer" @click="lightboxIndex = key" :style="{ 'background-image': 'url(' + GOOGLE_BUCKET_ENDPOINT + image.ResourceUrl + ')' }"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row mt16">
                                                <div class="col">
                                                    <div class="mt24">
                                                        <div class="t-l black">Videos</div>
                                                        <p class="light-grey mb0" v-if="!videos || videos.length == 0">No videos attached</p>
                                                        <div class="row mt16">
                                                            <div class="col-sm-4">
                                                                <div @click="addVideo" class="pointer border image d-flex flex-column justify-content-center align-items-center">
                                                                    <img class="p8" src="@/assets/images/add_asset.png" height="64px" alt />
                                                                    <div class="brand-primary">Upload Video</div>
                                                                </div>
                                                            </div>
                                                            <div class="col-sm-4 image-box" v-for="(video, key) in videos" :key="key">
                                                                <i class="image-delete-icon material-icons" @click="removeAddonResource(video._id)">delete</i>
                                                                <VideoCard :video-url="video.ResourceUrl" :id="video._id" @click="openVideo(video.ResourceUrl)"></VideoCard>
                                                            </div>
                                                            <div class="col"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row mt16">
                                                <div class="col">
                                                    <div class="mt24">
                                                        <div class="t-l black">Documents</div>
                                                        <p class="light-grey mb0" v-if="!documents || documents.length == 0">No documents attached</p>
                                                        <div class="row mt16">
                                                            <div class="col-sm-3">
                                                                <div @click="addDocument" class="mt16 pointer border document-box d-flex flex-column justify-content-center align-items-center">
                                                                    <img class="p8" src="@/assets/images/add_asset.png" height="48px" alt />
                                                                    <div class="brand-primary">Upload Document</div>
                                                                </div>
                                                            </div>
                                                            <div class="col-sm-3 mt16 document-box" v-for="(doc, key) in documents" :key="key">
                                                                <i class="image-delete-icon material-icons" @click="removeAddonResource(doc._id)">delete</i>
                                                                <div class="border p24 d-flex justify-content-start align-items-center">
                                                                    <div>
                                                                        <i class="material-icons t-xxl">insert_drive_file</i>
                                                                    </div>
                                                                    <div class="t-l ml16 black">{{ doc.ResourceName }}</div>
                                                                </div>
                                                            </div>
                                                            <div class="col"></div>
                                                        </div>
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
                    <b-tab title="Your Ad">
                        <h4 class="mt-4">Ad video</h4>
                        <span class="t-l">Your final Ad video will appear here. If you have chosen an Addon, our team of professionals will create and upload it here for you.</span>
                        <div v-if="clientAdPlan.AdVideo" class="ad-video mt16" @click="openVideo(clientAdPlan.AdVideo.ResourceUrl)">
                            <VideoCard :id="clientAdPlan.AdVideo._id" :auto-height="true" :video-url="clientAdPlan.AdVideo.ResourceUrl"></VideoCard>
                        </div>
                        <div v-if="!clientAdPlan.Addons || (clientAdPlan.Addons && clientAdPlan.Addons.length === 0)">
                            <span class="t-l">Please add your video by pressing the "Attach Video" button.</span>
                            <br />
                            <button @click="showVideoSelector" class="btn btn-primary-small mt16">Attach Video</button>
                        </div>
                    </b-tab>
                    <b-tab title="Ad Text">
                        <div class="mt32">
                            <div class="t-l">You can provide any additional details about your ad in the form of text using this section.</div>

                            <div class="ad-script mt24">
                                <textarea placeholder="Provide additional information about your ad here" rows="8" class="p24 form-control" v-model="clientAdPlan.Comments"></textarea>
                            </div>
                            <div class="action mt24 mb64 d-flex justify-content-start">
                                <button :disabled="clientAdPlan.Comments == null" @click="upateClientAdPlan" class="w-25 btn btn-full btn-primary">Save</button>
                            </div>
                        </div>
                    </b-tab>
                    <b-tab title="Billing & Transactions">
                        <div class="row mt32">
                            <div class="col-md-8" v-if="planTransactions.length > 0">
                                <div class="col-md-12 shadow-border p24">
                                    <div class="t-xl black">Initial Payment</div>
                                    <span class="t-m">Details of initial payment made for you plan.</span>
                                    <div class="mt24">
                                        <div class="row">
                                            <div class="col-md-8 col-6">
                                                <div class="brand-primary t-l">Channel Ad Plan</div>
                                            </div>
                                            <div class="col-md-4 col-6">
                                                <div class="black text-right t-l">{{ clientAdPlan.WeeklyAmount | currency }}</div>
                                            </div>

                                            <div class="col-md-8">
                                                <div class="t-m">
                                                    Plan Length:
                                                    <span class="bold">{{ clientAdPlan.ChannelProduct.ProductLength.Name }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="d-flex justify-content-between t-l mt32" v-if="clientAdPlan.Addons && clientAdPlan.Addons.length > 0">
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

                                        <div class="total">
                                            <div class="row mt32">
                                                <div class="col-6 col-sm-6">
                                                    <div class="t-l">Taxes</div>
                                                </div>
                                                <div class="col-6 col-sm-6 text-right">
                                                    <div class="amount t-l black pull-right">{{ planTransactions[0].TaxAmount | currency }}</div>
                                                </div>
                                            </div>
                                            <hr />
                                            <div class="row mt24">
                                                <div class="col-6 col-sm-6">
                                                    <h5 class="t-l black">Total Amount</h5>
                                                </div>
                                                <div class="col-6 col-sm-6 text-right">
                                                    <h5 class="amount t-xl black pull-right">{{ planTransactions[0].TotalAmount | currency }}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 mt-3 mt-md-0">
                                <div class="col-md-12 border shadow-sm p24 h-100 d-flex flex-column justify-content-between">
                                    <div>
                                        <div class="t-xl black">Payment Method</div>
                                        <span class="t-m">Payments for this plan are collected automatically on this card</span>
                                        <div class="t-l black mt24">
                                            <img class="mr16" :src="getImageUrl(clientAdPlan.PaymentMethod.Card.Vendor)" />
                                            XXXX XXXX XXXX {{ clientAdPlan.PaymentMethod.Card.LastFour }}
                                        </div>
                                    </div>
                                    <button @click="toggleUpdatePayment" class="mt-3 mt-md-0 btn btn-secondary">Update Payment Method</button>
                                </div>
                            </div>
                        </div>

                        <div class="table-wrapper mt32" v-if="planTransactions.length > 0">
                            <div class="t-xl black">Transactions</div>
                            <span class="t-m">Details of all the transactions for this plan</span>
                            <Table :items="planTransactions" :headings="fields" :pagination="pagination" :sort.sync="sort" responsive table-class="mt16 table-light table-responsive-xs table-responsive-stable-responsive-md">
                                <template v-slot:Status="data">
                                    <div class="bold" :class="data.value.Status.toLowerCase()">{{ data.value.Status }}</div>
                                </template>
                                <template v-slot:DateTime="data">
                                    <div>{{ data.value.DateTime | formatDate('DD MMM YYYY') }}</div>
                                </template>
                                <template v-slot:Amount="data">
                                    <div>{{ data.value.Amount | currency }}</div>
                                </template>
                                <template v-slot:TaxAmount="data">
                                    <div>{{ data.value.TaxAmount | currency }}</div>
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
import DocumentUpload from '@/webapp/common/modals/DocumentUpload';
import AttachVideo from '@/webapp/common/modals/AttachVideo';
import AttachImages from '@/webapp/common/modals/AttachImages';
import VideoModal from '@/webapp/common/modals/VideoModal';
import UpdateCard from '@/webapp/common/modals/UpdateCard';
import ResourceService from '@/services/ResourceService';
import CoolLightBox from 'vue-cool-lightbox';
import VideoUpload from '@/webapp/common/modals/VideoUploadModal';
import VideoCard from '@/webapp/common/components/VideoCard';
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css';

export default {
    name: 'AdPlanDetails',
    components: {
        WeekDays,
        Table,
        ImageUpload,
        AttachVideo,
        AttachImages,
        VideoModal,
        CoolLightBox,
        VideoCard,
        VideoUpload,
        DocumentUpload,
        UpdateCard
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
                    key: 'ReferenceId',
                    label: 'Reference ID'
                },
                {
                    key: 'Amount',
                    label: 'Amount'
                },
                {
                    key: 'TaxAmount',
                    label: 'Taxes'
                },
                {
                    key: 'TotalAmount',
                    label: 'Total Amount'
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
            planAssets: [],
            imagesSelected: [],
            showvideo: false,
            attachimages: false,
            videourl: '',
            lightBoxItems: [],
            lightboxIndex: null,
            showVideoUploadModal: false,
            showDocumentUploadModal: false,
            displayMode: 'VIEW',
            showUpdateCard: false
        };
    },
    methods: {
        addVideo() {
            this.showVideoUploadModal = true;
        },
        cancelVideUploadModal() {
            this.showVideoUploadModal = false;
        },
        closeVideoPlayer() {
            this.showvideo = false;
            this.videourl = '';
        },
        async downloadReceipt(transaction) {
            this.isLoading = true;
            this.isLoadingMessage = 'Generating your receipt';

            const result = await TransactionService.downloadReceipt(transaction);
            window.open(result);

            this.isLoading = false;
            this.isLoadingMessage = '';
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
        async removeAddonResource(resourceId) {
            try {
                this.$swal({
                    title: 'Are you sure?',
                    text: 'Asset will be removed from the plan',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Confirm',
                    closeOnConfirm: false
                }).then(async isConfirm => {
                    if (isConfirm.value) {
                        await ClientAdService.removeAddonResource(this.$route.params.planid, resourceId);
                        this.planAssets = this.planAssets.filter(function(item) {
                            return item._id != resourceId;
                        });
                        this.$swal({
                            title: 'Removed',
                            text: 'Asset has been removed from Ad Plan successfully',
                            type: 'success',
                            confirmButtonColor: '#ff6500'
                        });
                    }
                });
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
        closeVideUploadModal() {
            this.showVideoUploadModal = false;
        },
        showImageSelector() {
            this.attachimages = true;
        },
        addDocument() {
            this.showDocumentUploadModal = true;
        },
        handleUpdateCard(data) {
            this.showUpdateCard = false;
            if (data) {
                this.clientAdPlan.PaymentMethod = data;
            }
        },
        async handleDocumentUploadModal(data) {
            this.showDocumentUploadModal = false;
            data = JSON.parse(data);

            if (data) {
                try {
                    this.isLoading = true;
                    await ClientAdService.attachImages(this.$route.params.planid, [data._id]);
                    this.showUploadImageModal = false;
                    this.showVideoUploadModal = false;
                    this.planAssets.push(data);
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
        addImage() {
            this.showUploadImageModal = true;
        },
        closeAttachImages() {
            this.attachimages = false;
        },
        cancelImageUploadModal() {
            this.showUploadImageModal = false;
        },
        async closeImageUploadModal(data) {
            try {
                this.isLoading = true;
                await ClientAdService.attachImages(this.$route.params.planid, [data._id]);
                this.showUploadImageModal = false;
                this.showVideoUploadModal = false;
                this.planAssets.push(data);
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
                this.planTransactions = await TransactionService.getTransactions(this.getUser().Owner._id, this.$route.params.planid);
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
                    const result = await ClientAdService.attachVideo(this.$route.params.planid, video._id);
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
        async handleAttachAssets(assets) {
            if (assets.length > 0) {
                try {
                    this.isLoading = true;
                    ClientAdService.attachImages(this.$route.params.planid, assets);

                    for (let i = 0; i < this.clientResources.length; i++) {
                        assets.map(asset => {
                            if (asset == this.clientResources[i]._id) {
                                this.planAssets.push(this.clientResources[i]);
                            }
                        });
                    }

                    this.$swal({
                        title: 'Added',
                        text: 'Assets attached successfully',
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
        async upateClientAdPlan() {
            try {
                this.isLoading = true;
                await ClientAdService.updatePlan(this.$route.params.planid, this.clientAdPlan);
                this.$swal({
                    title: 'Updated',
                    text: 'Details updated successfully',
                    type: 'success',
                    confirmButtonColor: '#ff6500'
                });
                this.isLoading = false;
                this.displayMode = 'VIEW';
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
        openVideo(url) {
            this.showvideo = true;
            this.videourl = this.GOOGLE_BUCKET_ENDPOINT + url;
        },
        forwardVideo(id) {
            let elem = document.getElementById(id);
            elem.currentTime = 2;
        },
        getImageUrl(vendor) {
            return require('@/assets/images/cards/' + vendor.toUpperCase() + '.svg');
        },
        toggleUpdatePayment() {
            this.showUpdateCard = !this.showUpdateCard;
        },
        ...mapGetters(['getUser'])
    },
    computed: {
        images() {
            return this.planAssets.filter(resource => {
                return resource.ResourceType == 'IMAGE';
            });
        },
        videos() {
            return this.planAssets.filter(resource => {
                return resource.ResourceType == 'VIDEO';
            });
        },
        documents() {
            return this.planAssets.filter(resource => {
                return resource.ResourceType == 'DOCUMENT';
            });
        }
    },
    async created() {
        try {
            this.clientAdPlan = await ClientAdService.getPlanDetails(this.$route.params.planid);
            this.planAssets = this.clientAdPlan.AddOnAssets;
            this.clientResources = await ResourceService.getResources();
            this.lightBoxItems = this.planAssets.filter(asset => {
                return asset.ResourceType == 'IMAGE';
            });

            this.lightBoxItems = this.lightBoxItems.map(asset => {
                let tmp = {};
                tmp.src = this.GOOGLE_BUCKET_ENDPOINT + asset.ResourceUrl;
                return tmp;
            });

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
.heading-input {
    font-size: 32px;
    font-weight: bold;
    color: $brand-secondary;
    width: 600px;
    background: linear-gradient(#ccc, #ccc) center bottom 0px / calc(100%) 1px no-repeat;
    border: none;
    padding-bottom: 24px;
}

.document-box {
    height: 80px;
    .image-delete-icon {
        z-index: 1;
        position: absolute;
        right: 20px;
        cursor: pointer;
        top: 8px;
        display: none;
    }
    &:hover {
        .image-delete-icon {
            display: block;
        }
    }
}

.image-box {
    .image-delete-icon {
        z-index: 1;
        position: absolute;
        right: 20px;
        cursor: pointer;
        color: white;
        top: 8px;
        display: none;
    }
    .image {
        width: auto;
        height: 200px;
        border-radius: 6px;
        background-position: center center;
        background-size: cover;
    }
    &:hover {
        .image-delete-icon {
            display: block;
        }
    }
}
.image {
    width: auto;
    height: 200px;
}
</style>
