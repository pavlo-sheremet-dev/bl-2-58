import { useEffect, useState } from 'react';

import * as ImageService from 'service/image-service';
import { Button, SearchForm, Grid, GridItem, Text, CardItem } from 'components';

export const Gallery = function () {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    if (!query) return

    getPhotos(query, page);
  }, [query, page])
  
  
  async function getPhotos(query, page) {
    setIsLoading(true);

    try {
      const {
        photos,
        total_results,
        per_page,
        page: currentPage,
      } = await ImageService.getImages(query, page);

      if (photos.length === 0) {
        setIsEmpty(true);
      }

      setImages((prevImages) => [...prevImages, ...photos]);
      setIsVisible(currentPage < Math.ceil(total_results / per_page))
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  function onLoadMore() {
    setPage((prevPage) => prevPage + 1)
  };

  function onHandleSubmit(value) {
    setQuery(value);
    setPage(1);
    setImages([]);
    setError(null);
    setIsEmpty(false);
  };

  return (
    <>
      <SearchForm onSubmit={onHandleSubmit} />

      {error && (
        <Text textAlign="center">❌ Something went wrong - {error}</Text>
      )}

      {isEmpty && (
        <Text textAlign="center">Sorry. There are no images ... 😭</Text>
      )}

      <Grid>
        {images.length > 0 &&
          images.map(({ id, avg_color, alt, src }) => (
            <GridItem key={id}>
              <CardItem color={avg_color}>
                <img src={src.large} alt={alt} />
              </CardItem>
            </GridItem>
          ))}
      </Grid>

      {isVisible && (
        <Button onClick={onLoadMore} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Load more'}
        </Button>
      )}
    </>
  );
};