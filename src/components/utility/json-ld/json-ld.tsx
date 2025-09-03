import Script from "next/script";
import Head from "next/head";

export interface JsonLdProps {
  id: string;
  data: Record<string, any> | string;
}

export const JsonLd: React.FC<JsonLdProps> = ({ id, data }) => {
  console.log('[JSON-LD COMPONENT] Rendering JsonLd component', {
    id,
    dataType: typeof data,
    dataValue: data,
    hasData: !!data
  });
  
  const jsonString = typeof data === 'string' ? data : JSON.stringify(data);
  
  console.log('[JSON-LD COMPONENT] Generated JSON string', {
    jsonString,
    jsonStringLength: jsonString?.length
  });
  
  return (
    <Head>
      <script
        id={id}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonString }}
      />
    </Head>
  );
};