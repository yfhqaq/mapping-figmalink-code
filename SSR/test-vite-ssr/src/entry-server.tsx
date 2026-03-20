import App from "./App";
// import './index.css'
export async function fetchData() {
    return { user: 'xxx' }
  }
function ServerEntry(props: any) {
    console.log(props)
    return (
        <App />
    );
}

export { ServerEntry };