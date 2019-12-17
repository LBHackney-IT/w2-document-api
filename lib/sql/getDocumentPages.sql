SELECT
  W2Page.PAGE_NO AS page,
  W2Image.IS_HDL AS imageId
FROM
  W2Page
  JOIN W2Image ON W2Page.IMAGE_HDL = W2Image.HDL
WHERE
    W2Page.HDL = @id
ORDER BY
    W2Page.PAGE_NO;