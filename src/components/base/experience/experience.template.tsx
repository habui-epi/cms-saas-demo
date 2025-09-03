import { useQuery } from "@apollo/client";
import { CompositionDisplaySetting, ElementNodeFragment, SectionNodeFragment } from "@generated/graphql";
import { useContentSaved } from "@hooks";
import { useEffect, useMemo } from "react";
import { SectionTemplate } from "../section/section.template";
import { ExperienceQuery } from "./experience.graphql";
import { GetExperienceStyles } from "./experience.style";
import { useGlobalContext } from "@context";
import { ElementTemplate } from "../element/element.template";
import { SEOComponent } from "../seo";

interface ExperienceTemplateProps {
  contentGuid?: string | null; // Content GUID
  version?: string | null; // Optional version
  locale?: string | null; // Optional locale
  // Or queried by just URL
  url?: string | null; // Matched against the URL.Default
}

export const ExperienceTemplate: React.FC<ExperienceTemplateProps> = ({ contentGuid, version, locale, url }) => {
  const { setIsLoading } = useGlobalContext();
  const queryVariables = { key: contentGuid, version, locale, url, status: url ? "Published" : undefined };

  const { data, refetch, error, loading } = useQuery(ExperienceQuery, {
    variables: queryVariables,
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      console.warn("[QUERY] Error fetching Experience", error);
      setIsLoading(false);
      // refetch(queryVariables);
    },
    onCompleted: (data) => {
      console.log("[QUERY] Query finished with variables", queryVariables, data);
      console.log("[QUERY] Query finished with variables", { version, locale, url, error });
      console.log("[QUERY] Query result", data?.content?.items);
      setIsLoading(false);
    },
  });

  const experience = useMemo(() => {
    const items = data?.content?.items;
    if (!data || !items || items.length === 0) {
      return null;
    }

    return items[0];
  }, [data]);

  useContentSaved((data) => {
    const [contentId, contentVersion] = data.contentLink.split("_");
    if (contentVersion) {
      queryVariables.version = contentVersion;
    }

    refetch(queryVariables);
  });

  useEffect(() => {
    if (loading) {
      setIsLoading(true);
    }
  }, [loading]);

  const sections = useMemo(() => experience?.composition?.sections ?? [], [experience]);

  const classes = useMemo(() => {
    return GetExperienceStyles(experience?.composition?.displaySettings as CompositionDisplaySetting[]);
  }, [experience]);

  const seoData = useMemo(() => {
    if (experience?.__typename === 'AiSeoGeoExperience') {
      const seoExperience = experience as any;
      return {
        title: seoExperience.Title,
        metaTitle: seoExperience.MetaTitle,
        metaDescription: seoExperience.MetaDescription,
        keywords: seoExperience.Keywords,
        canonicalUrl: seoExperience.CanonicalUrl?.default,
        ogTitle: seoExperience.OgTitle,
        ogDescription: seoExperience.OgDescription,
        ogImage: seoExperience.OgImage?.url?.default,
        twitterTitle: seoExperience.TwitterTitle,
        twitterDescription: seoExperience.TwitterDescription,
        twitterImage: seoExperience.TwitterImage?.url?.default,
      };
    }
    return null;
  }, [experience]);

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

  if (!experience && !loading) {
    return null;
  }

  return (
    <>
      {seoData && <SEOComponent {...seoData} />}
      <article className={classes}>
        {sections.map((section: any) => {
          if (section) {
            if (section.__typename === "CompositionStructureNode") {
              return <SectionTemplate section={section as SectionNodeFragment} key={section.key} />
            }
            else {
              return <ElementTemplate element={section as ElementNodeFragment} key={section.key} />
            }
          }
        })}
      </article>
    </>
  );
};
