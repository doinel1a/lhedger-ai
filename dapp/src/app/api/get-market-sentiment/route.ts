import { NextResponse } from 'next/server';

import { env } from '@/env';
import { tokenMetrics } from '@/lib/constants/routes';

export async function GET() {
  try {
    const request = await fetch(`${tokenMetrics.api}/sentiments`, {
      headers: {
        accept: 'application/json',
        api_key: env.TOKEN_METRICS_API_KEY
      }
    });

    if (!request.ok) {
      return new Response('Something went horribly wrong', { status: 500 });
    }

    try {
      const response = await request.json();

      if (
        response &&
        typeof response === 'object' &&
        'data' in response &&
        response.data &&
        Array.isArray(response.data)
      ) {
        const responseData = response.data[0];
        if (
          responseData &&
          typeof responseData === 'object' &&
          // --
          'NEWS_SENTIMENT_GRADE' in responseData &&
          responseData.NEWS_SENTIMENT_GRADE &&
          typeof responseData.NEWS_SENTIMENT_GRADE === 'number' &&
          // --
          'NEWS_SUMMARY' in responseData &&
          responseData.NEWS_SUMMARY &&
          typeof responseData.NEWS_SUMMARY === 'string' &&
          // --
          'TWITTER_SENTIMENT_GRADE' in responseData &&
          responseData.TWITTER_SENTIMENT_GRADE &&
          typeof responseData.TWITTER_SENTIMENT_GRADE === 'number' &&
          // --
          'TWITTER_SUMMARY' in responseData &&
          responseData.TWITTER_SUMMARY &&
          typeof responseData.TWITTER_SUMMARY === 'string'
        ) {
          const newsSentimentGrade = responseData.NEWS_SENTIMENT_GRADE;
          const newsSentimentSummary = responseData.NEWS_SUMMARY;
          const twitterSentimentGrade = responseData.TWITTER_SENTIMENT_GRADE;
          const twitterSentimentSummary = responseData.TWITTER_SUMMARY;

          return NextResponse.json(
            {
              data: {
                news: {
                  grade: newsSentimentGrade,
                  summary: newsSentimentSummary
                },
                twitter: {
                  grade: twitterSentimentGrade,
                  summary: twitterSentimentSummary
                }
              }
            },
            { status: 200 }
          );
        }
      }
    } catch (error) {
      console.error(
        'SERVER ERROR | Could not deserialize response body from TokenMetrics API',
        error
      );

      return NextResponse.json(
        { error: 'Could not deserialize response body from TokenMetrics AP' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('SERVER ERROR | Could not fetch data from TokenMetrics API', error);

    return NextResponse.json(
      { error: 'Could not fetch data from TokenMetrics API' },
      { status: 500 }
    );
  }
}
