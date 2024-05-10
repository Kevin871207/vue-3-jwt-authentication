<template>
  <div class="container">
    <div class="card card-table">
      <div class="card-header">
        <h4>書籍查閱狀況</h4>
      </div>
      <table class="table table-RWD table-bordered">
        <thead>
        <tr>
          <th width="9%">國際標準書號(ISBN)</th>
          <th width="22%">書名</th>
          <th width="10%">作者</th>
          <th width="10%">書籍內容簡介</th>
          <th width="10%">書籍入庫(購買)日期時間</th>
          <th width="15%">書籍狀態(點案即可借閱或歸還)</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in inventoryData" :key="index">
          <td data-th="國際標準書號">{{item.isbn}}</td>
          <td data-th="書名">{{item.name}}</td>
          <td data-th="作者">{{item.author}}</td>
          <td data-th="書籍內容簡介">{{item.introduction}}</td>
          <td data-th="書籍入庫(購買)日期時間">{{item.storeTime}}</td>
          <td data-th="書籍狀態(點按即可借閱或歸還)" class="num text-end"><a class="link-underline" @click="checkAction(item.isbn, item.status, item.inventoryId)">{{item.status}}</a></td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

import InventoryService from "../services/inventory.service";
import BorrowingRecordsService from "../services/borrowingRecords.service";
import BookService from "../services/book.service";
import moment from 'moment-timezone';

export default {
  name: 'Profile',
  data() {
    return {
      inventoryData: [],
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  mounted() {
    console.log('currentUser', this.currentUser);
    this.getAllBookStatus();

    if (!this.currentUser) {
      this.$router.push('/login');
    }
  },
  methods: {
    getAllBookStatus() {
      InventoryService.getAllInventoryStatus().then(
        (response) => {
          response.data.forEach((item) => {
            item.storeTime = moment(item.storeTime).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss');
          })
          console.log('response', response.data);
          response.data.sort((a, b) => {
            return a.isbn < b.isbn ? 1 : -1;
          });
          this.inventoryData = response.data;
        },
        (error) => {
          console.log(error);
        }
      );
    },
    checkAction: async function(isbn, status, inventoryId) {

      let borrowingRecordsresult = await BorrowingRecordsService.getRetunTimeNullborrowingRecordRes(inventoryId, this.currentUser.id);
      console.log('borrowingRecordsresult', borrowingRecordsresult.data);
      try {
        if (status === "AVAILABLE") {
          await BookService.borrowBook(isbn, this.currentUser.id)
          alert('(ISBN) ' + isbn +' 此書已被你成功借出');
        } else if (status === "BORROWED" && borrowingRecordsresult.data.length === 0) {
          alert('(ISBN) '+ isbn +' 此書已借出無法借閱');
        } else if (status === "BORROWED" && borrowingRecordsresult.data.length != 0) {
          await BookService.returnBook(isbn, this.currentUser.id)
          alert('(ISBN) '+ isbn +' 此書已被你成功歸還');
        }
      } catch (error) {
        console.log(error);
      }
      this.getAllBookStatus();
    }
  }
};
</script>