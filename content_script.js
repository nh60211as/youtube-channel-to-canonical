function validateIsOnChannelHomePage(url) {
  /***
   * match URL in the format of https://www.youtube.com/@chionNK
   */
  const regex1 = new RegExp("^https://www.youtube.com/@[^/]*$");
  /***
   * match URL in the format of https://www.youtube.com/@chionNK/featured
   */
  const regex2 = new RegExp("^https://www\.youtube\.com/@[^/]*/featured$");

  return regex1.test(url) || regex2.test(url);
}

function checkIfIsOnChannelHomePage() {
  /***
   * find the element
   * <yt-tab-group-shape class="yt-tab-group-shape-wiz yt-tab-group-shape-wiz--overflow-hidden style-scope ytd-c4-tabbed-header-renderer">
   */
  const nullableChannelTabParent = document.querySelector("yt-tab-group-shape");
  console.log("nullableChannelTabParent", nullableChannelTabParent);
  if (nullableChannelTabParent === null) {
    console.log("nullableChannelTabParent is null");
    return false;
  }

  /***
   * find the element
   * <div class="yt-tab-group-shape-wiz__tabs" role="tablist">
   */
  const nullableChannelTabList = nullableChannelTabParent.querySelector(
    'div[role="tablist"]'
  );
  console.log("nullableChannelTabList", nullableChannelTabList);
  if (nullableChannelTabList === null) {
    console.log("nullableChannelTabList is null");
    return false;
  }

  /***
   * find the 0th element which is most likely to be home page tab
   * <yt-tab-shape class="yt-tab-shape-wiz yt-tab-shape-wiz--host-clickable" role="tab" aria-selected="true" tabindex="0" tab-title="首頁">
   */
  const homePageTab =
    nullableChannelTabList.getElementsByTagName("yt-tab-shape")[0];

  const isHomePageSelected = homePageTab.getAttribute("aria-selected");
  if (isHomePageSelected !== "true") {
    console.log("isHomePageSelected is not true");
    return false;
  }

  return true;
}

function getCanonicalChannelLink() {
  /***
   * find link
   * <link rel="canonical" href="https://www.youtube.com/channel/UCeeUqiYJFwJSuFkfxHKwASQ">
   */
  const canonicalLinkMatches = document.querySelectorAll(
    'link[rel="canonical"]'
  );
  console.log("canonicalLinkMatches.length", canonicalLinkMatches.length);

  for (const element of canonicalLinkMatches) {
    console.log("element", element);
    const nullableUrl = element.getAttribute("href");
    console.log("nullableUrl", nullableUrl);

    if (nullableUrl !== null) {
      return nullableUrl;
    }
  }

  return null;
}

function mainFunction() {
  const isOnChannelHomePage = validateIsOnChannelHomePage(location.href);
  // TODO: Could not get the channel home page to execute on complete load yet
  //   const isOnChannelHomePage = checkIfIsOnChannelHomePage();

  if (!isOnChannelHomePage) {
    console.log("isOnChannelHomePage is not true");
    return;
  }

  // TODO: The content_script.js only get executed on page reload
  const nullableCanonicalChannelLink = getCanonicalChannelLink();
  console.log("nullableCanonicalChannelLink", nullableCanonicalChannelLink);
  if (nullableCanonicalChannelLink === null) {
    return;
  }

  if (location.href !== nullableCanonicalChannelLink) {
    console.log("location.href !== nullableCanonicalChannelLink");
    location.href = nullableCanonicalChannelLink;
  }
}

mainFunction();
