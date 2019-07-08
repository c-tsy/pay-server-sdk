import axios from 'axios';
import { MD5 } from '@ctsy/crypto';
const req = axios.create({ withCredentials: true })
req.interceptors.response.use((data) => {
    if (data.data) {
        if (data.data.c == 200) {
            return data.data.d;
        } else {
            throw new Error(data.data.e.m);
        }
    }
    throw new Error('请求错误');
})
export default class TSYPay {
    Gateway: string = "https://pay.tansuyun.cn/"
    AID: number = 0;
    Secret: string = "";
    Name: string = "";
    /**
     * 
     * @param AID AID参数
     * @param Name 系统在支付中的名称
     * @param Secret 加密验证密钥
     */
    constructor(AID: number, Name: string, Secret: string) {
        this.AID = AID; this.Name = Name; this.Secret = Secret;
    }
    /**
     * 创建订单
     * @param Title 
     * @param TradeID 
     * @param Money 
     * @param Content 
     * @param Channel 
     */
    async create(Title, TradeID, Money, Content, Channel = '') {
        let pay = await req.post(this.Gateway + 'Pay/create', {
            Channel,
            Money,
            AID: this.AID,
            Title,
            Content,
            TradeID
        });
        return pay;
    }
    /**
     * 退款
     * @param TradeID 交易号
     * @param Money 金额
     * @param Reason 原因
     */
    async refund(TradeID, Money, Reason) {
        let T = Date.now();
        let Sign = MD5.encode([this.AID, T, TradeID, Money, Reason, this.Secret].join(''))
        return await req.post(this.Gateway + 'Pay/refund', { TradeID, Money, Reason, T, Sign, AID: this.AID });
    }
    /**
     * 
     * @param TradeID 
     */
    async query(TradeID: string) {
        return await req.post(this.Gateway + 'Pay/query', { TradeID, AID: this.AID });
    }
    async getPayURL() { }
    /**
     * 
     * @param TradeID 
     * @param To 
     * @param Money 
     * @param Reason 
     * @param Name 
     */
    async transfer(TradeID: string | number, To: string, Money: number, Reason: string, Name?: string) {
        let t = Date.now();
        let rs = await req.post(this.Gateway + 'Pay/transfer', { TradeID, AID: this.AID, T: t, To, Money, Name, Reason, Sign: MD5.encode([this.AID, t, TradeID.toString(), Money, To, Reason, this.Secret].join('')) })
        return rs;
    }
    verify() { }
}