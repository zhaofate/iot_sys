import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote';


export default function Mdx(props: MDXRemoteProps) {
return (
<MDXRemote
{...props}
components={{
h1: (props) => <h1 className="text-3xl font-bold">{props.children}</h1>,

}}
/>
);
}
