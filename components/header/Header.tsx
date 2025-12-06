import { Colors } from '@/constants/theme';

import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Text } from '@/components/ui/text';

export default function Header() {
    return (
        <Center className='mt-20'>
            <Text className="font-semibold" style={{ color: Colors.light.text_primary }}>Header Components</Text>
            <Divider className="my-4 w-[90%]"
                style={{ backgroundColor: Colors.light.border }}
            />
        </Center>
    )
}
