# CRC7-MMC Calculator

This is the CRC7-MMC Calculator needed to calculate the CRC of SDCard.

Referenced the code below:

```c
#include <stdio.h>

unsigned char CRC7(unsigned char *chr, int cnt)
{
    unsigned char arrayIndex, index;
    unsigned char crc, value;

    crc = 0;
    for (arrayIndex = 0; arrayIndex < cnt; arrayIndex++)
    {
        value = chr[arrayIndex];
        for (index = 0; index < 8; index++)
        {
            crc <<= 1;

            if ((value & 0x80) ^ (crc & 0x80))
                crc ^= 0x09;
            value <<= 1;
        }
    }
    return crc << 1;
}

#define SD_COMMAND 8
#define SD_ARGUMENT 0x000001AA

int main(void)
{
    unsigned char input[] = {(SD_COMMAND | 0x40),
                             (unsigned char)(SD_ARGUMENT >> 24),
                             (unsigned char)(SD_ARGUMENT >> 16),
                             (unsigned char)(SD_ARGUMENT >> 8),
                             (unsigned char)(SD_ARGUMENT)};

    printf("CRC7 : 0x%02X\n", CRC7(input, 5));

    return 0;
}
```
