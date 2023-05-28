import { useEffect } from "react";

function Page(props) {
  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  return props.component;
}

export default Page;
