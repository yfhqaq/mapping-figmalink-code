const first: string = 'asdcac'
const second: Number = 12
const arr: Array<string> = ['w']
const arr1 = ['mmmk']
let foo: string = 'Hi';



enum userLevel {
    visitor = 100,
    admin = 101,
    super = 102
}
console.log(userLevel.visitor)
function test(params: unknown): string {
    (params as string).charAt(0)
    return '' + params ?? [0]
}
console.log(test([]))

interface IUser {
    name: string;
    job?: IJob;
}

interface IJob {
    title: string;
}

let user: IUser = {
    name: 'foo',
    job: {
        title: 'bar',
    },
};

//   const { name, job = {} as IJob} = user;

//   const { title } = job; // 类型“{}”上不存在属性“title”。


type study = (one: number, two: string, three: string[]) => string
const stu: study = () => {
    return 'dsd'
}

type Status='first'|'second'|'three'
const shunxu:Status='first'
const s:Status="second"

interface VisitorUser {}
interface CommonUser {}
interface VIPUser {}
interface AdminUser {}

type User = VisitorUser | CommonUser | VIPUser | AdminUser;

const xixi: User = {
  // ...任意实现一个组成的对象类型
}


type Statu<T> = 'success' | 'failure' | 'pending' | T;

type CompleteStatus = Statu<'offline'>;
