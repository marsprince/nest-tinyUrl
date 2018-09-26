## Description
This's a tinyUrl module for [Nest](https://github.com/nestjs/nest) to generate short url.

## Installation

```bash
$ npm install nest-tinyurl
```

## Quick Start

### Include entity
```typescript
export { TinyUrl } from 'nest-tinyurl';
```

### Include module
```typescript
import { TinyUrlModule } from 'nest-tinyurl';
```

### Use service
```typescript
import { TinyUrlService } from 'nest-tinyurl';
```

generate
```typescript
TinyUrlService.generateShortUrl(url)
```

get
```typescript
TinyUrlService.getUrlByShortUrl(url)
```