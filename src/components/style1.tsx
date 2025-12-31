import {
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Link,
  Img,
} from "@react-email/components";

export default function Style1() {
  return (
    <Container className="bg-white rounded-[8px] mx-auto max-w-[900px] overflow-hidden p-0">
      {/* HERO */}
      <Section>
        <Row className="bg-[rgb(41,37,36)] border-separate [border-spacing:24px] table-fixed w-full">
          <Column className="pl-[12px]">
            <Heading
              as="h1"
              className="text-white text-[28px] font-bold mb-[10px]"
            >
              Coffee Storage
            </Heading>

            <Text className="text-white/60 text-[14px] leading-[20px] m-0">
              Keep your coffee fresher for longer with innovative technology.
            </Text>

            <Link
              href="#"
              className="text-white/80 block text-[14px] font-semibold mt-[12px] no-underline"
            >
              Shop now →
            </Link>
          </Column>

          <Column className="w-[42%] h-[250px]">
            <Img
              src="https://react.email/static/coffee-bean-storage.jpg"
              alt="Coffee Storage"
              className="rounded-[4px] h-full object-cover w-full"
            />
          </Column>
        </Row>
      </Section>

      {/* PRODUCTS */}
      <Section className="mb-[24px]">
        <Row className="border-separate [border-spacing:12px] table-fixed w-full">
          <Column className="mx-auto max-w-[180px]">
            <Img
              src="https://react.email/static/atmos-vacuum-canister.jpg"
              alt="Vacuum Canister"
              className="rounded-[4px] mb-[18px] w-full"
            />
            <Heading as="h2" className="text-[14px] font-bold mb-[8px]">
              Auto-Sealing Canister
            </Heading>
            <Text className="text-gray-500 text-[12px] leading-[20px] m-0">
              Airtight seal with a single button press.
            </Text>
          </Column>

          <Column className="mx-auto max-w-[180px]">
            <Img
              src="https://react.email/static/vacuum-canister-clear-glass-bundle.jpg"
              alt="Vacuum Containers"
              className="rounded-[4px] mb-[18px] w-full"
            />
            <Heading as="h2" className="text-[14px] font-bold mb-[8px]">
              3-Pack Containers
            </Heading>
            <Text className="text-gray-500 text-[12px] leading-[20px] m-0">
              Keeps coffee fresh for weeks.
            </Text>
          </Column>
        </Row>
      </Section>
    </Container>
  );
}
